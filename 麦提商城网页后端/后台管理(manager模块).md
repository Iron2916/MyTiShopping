# 一. 简介

后台管理模块对接的是 "后台管理前端页面"



# 二. 设计难点

## 1. 递归获得菜单的树形结构

```
/admin/system/sysMenu/findeNode
```

``` java
    public static List<SysMenu> generateMenuNode(List<SysMenu> sysMenuList) {

        List<SysMenu> menuNode = new ArrayList<>();
        for (SysMenu sysMenu : sysMenuList) {

            if (sysMenu.getParentId() == 0) {
                // 找到递归的入口，第一层目录菜单
                menuNode.add(sysMenu);
                backTracing(sysMenu, sysMenuList);
            }
        }
        return menuNode;
    }

    private static void backTracing(SysMenu curMenu, List<SysMenu> sysMenuList) {

        long curId = curMenu.getId();
        List<SysMenu> children = new ArrayList<>();

        for (SysMenu menu : sysMenuList) {

            if (curId == menu.getParentId()) {
                // 找到当前节点的所有子节点进行加入

                children.add(menu);
                backTracing(menu, sysMenuList);     // 将此节点进行下一轮的递归寻找其子目录
            }
        }

        curMenu.setChildren(children);
    }
```

## 2. xxl-job进行定时计算每日成交额

``` java
    @Autowired
    OrderInfoMapper orderInfoMapper;

    /**
     * XXL-JOB定时任务：每天陵城两点统计OrderInfo表里面的数据生成对应的Orderstatistic对象并插入到表中
     */

    @XxlJob("InsertOrderStatistic")
    public void CreateOrderStatistics() {

        // 生成昨天的时间
        final String yestodayDate = DateUtil.offsetDay(new Date(), -1).toString(new SimpleDateFormat("yyyy-MM-dd"));
        System.out.println("-------------------- xxljob定时任务启动 --------------------------------");
        // 根据昨天的时间生成对应的OrderStatistic对象
        final OrderStatistics orderStatistics = orderInfoMapper.createOrderStatisticsByOrderInfoTime(yestodayDate);
        System.out.println("orderStatistics = " + orderStatistics);
        // 将生成的每日订单信息插入到到表中
        if (orderStatistics != null) {

            orderStatisticMapper.insert(orderStatistics);
        }
    }
```



## 3. EasyExcel实现批量导入商品类

**监视器：**

```java
private static int CACHE_COUNT = 100;

private List<CategoryExcelVo> cacheList = ListUtils.newArrayListWithExpectedSize(CACHE_COUNT);

private CategoryMapper categoryMapper;
public CategoryListener(CategoryMapper categoryMapper) {

    this.categoryMapper = categoryMapper;
}

// 这里进行监控，每次读取一定大小。
@Override
public void invoke(CategoryExcelVo categoryExcelVo, AnalysisContext analysisContext) {

    cacheList.add(categoryExcelVo);
    if (cacheList.size() >= CACHE_COUNT) {

        categoryMapper.addByList(cacheList);
        cacheList = ListUtils.newArrayListWithExpectedSize(CACHE_COUNT);
    }
}

@Override
public void doAfterAllAnalysed(AnalysisContext analysisContext) {
    System.out.println("----------------------------------" + cacheList);
    categoryMapper.addByList(cacheList);
}
```

**调用：**

``` java
    /**
     * 根据前端传递过来的excel文件调用api监听数据
     * @param file
     */
    @Override
    public void importFromExcel(MultipartFile file) {

        try {
            final CategoryListener categoryListener = new CategoryListener(categoryMapper);
            EasyExcel.read(file.getInputStream(), CategoryExcelVo.class, categoryListener).sheet().doRead();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
```



## 4. BUG一：角色分配菜单全选问题。

问题描述：先将角色某个菜单全选，然后新增一个菜单，回头去看发现新增菜单也被选上了。

为 role_menu 表增加一个 is_half 是否半开字段(0：全开，1：半开)

只要是新增加的菜单，就得将此菜单的所有父菜单设置为 半开。

后端返回：
``` java
/**
* 查询出用户全开的菜单id(被选择)，以及全部菜单树形结构
* @param
* @return
*/
@Override
public Map<String, Object> findeSysRoleMenuByRoleId(int roleId) {

    Map<String, Object> map = new HashMap<>();
    final List<SysMenu> sysMenuList = sysMenuService.findeNode();
    List<Integer> roleMenuIds = sysRoleMapper.findeRoleMenuIds(roleId);	// 这里只查询 is_half = 0 全开
    map.put("sysMenuList" , sysMenuList) ;
    map.put("roleMenuIds" , roleMenuIds) ;
    return map;
}
```

前端接受参数：
``` js
<el-tree
          ref="treeRef"					// 通过此参数进行获得 父亲不全选 和 选中子类
          style="max-width: 600px"
          :data="sysMenuList"			// 后端返回的所有菜单的树形结构
          show-checkbox
          default-expand-all
          node-key="id"
          highlight-current
          :props="defaultProps"
          :default-checked-keys="roleMenuIds"	// 后端返回默认全选标签
/>
```

前端发起新增菜单请求：

``` js
const doAssgin = async (row) => {

  // 通过 ref 筛选出 全选和半选的选项，后端忽略半选，不然半选的被选择了其子节点全会被选择
  const checkNodes = treeRef.value.getCheckedNodes()	// 获得选择的标签
  const checkedNodes = Array.from(checkNodes).map(node => {
    return {
            id: node.id,
            isHalf: 0
        }
  })

const checKHalfNodes = treeRef.value.getHalfCheckedNodes()	// 获得非全选的父类标签
const halfCheckedNodesIds = Array.from(checKHalfNodes).map(node => {
  return {
          id: node.id,
          isHalf: 1
      }
})
const menuIds = [...checkedNodes , ...halfCheckedNodesIds]
console.log(menuIds);

// 构建创建角色menu对象
const assginDto = {
  roleId: roleId.value,
  menuIdList: menuIds
}
console.log(assginDto);

const {code} = await DoAssign(assginDto)
if (code === 200) {
  ElMessage.success("用户菜单添加成功！")
} else {
  ElMessage.warning("用户菜单添加失败!")
}
}
```



## 5.  AOP + 自定义注解实现日志注解

**自定义注解：**

``` java
/**
 * 自定义对应的 日志log注解
 */
@Target({ElementType.METHOD})        //这里的注解都是固定的可以防战其他的注解进行查看开头都是这两个注解
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {

    public String title();      // 模块名称
    public OperatorType operatorType() default OperatorType.MANAGE;	// 操作人类别(默认是手机端客户)
    public int businessType();      // 业务类型(0其他 1新增 2修改， 3删除)
    public boolean isSaveRequestData() default true;        // 是否保存请求的参数
    public boolean isSaveResponseData() default true;       // 是否保存响应的参数
}
```

**自定义AOP切面类：**

通过反射获取到注解里面的内容，然后插入到数据库中。

``` java
@Aspect
@Component
@Slf4j
public class LogAspect {

    @Autowired
    AsyncSysOperLogService asyncSysOperLogService;
    
    /**
     * 这里没有用传统的 @Around("execution(* com.example.service.MyService.*(..))")
     * 而是导入了自定的注解类 Log 所以实现了只有注解了才进行日志记录
     * @param joinPoint
     * @param sysLog
     * @return
     */
    @Around(value = "@annotation(sysLog)")
    public Object doAroundAdvice(ProceedingJoinPoint joinPoint, Log sysLog) {

        final SysOperLog sysOperLog = new SysOperLog();

        // 提交前将数据赋值到 sysOperLog 实体类中
        AspectLogUtils.beforeHandleLog(sysLog, joinPoint, sysOperLog);

        Object proceed = null;
        String title = sysLog.title();
        log.info("LogAspect...doAroundAdvice方法执行了"+title);

        try {

            proceed = joinPoint.proceed();          // 执行业务方法(相当于进行放行)
            AspectLogUtils.afterHandleLog(sysLog, proceed, sysOperLog, 0, null);    // 执行正常
        } catch (Throwable e) {

            e.printStackTrace();
            AspectLogUtils.afterHandleLog(sysLog, proceed, sysOperLog, 1, e.getMessage());  // 执行异常
            throw new RuntimeException(e);          // 业务方法执行产生异常，不然会因为顺序低于和transaction(也是aop),造成无法实现事务回滚
        }

        // 插入表
        asyncSysOperLogService.saveSysOperLog(sysOperLog);
        return proceed;
    }
}

```

``` java
/**
 *  注解日志辅助类
 */
public class AspectLogUtils {

    /**
     * 日志提交前执行的方法(根据前面的两个params封装传递过来的sysOperLog)
     * @param sysLog 自定以的日志注解，里面包含了方法信息
     * @param joinPoint 切面方法变量
     * @param sysOperLog 系统的日志实体类
     */
    public static void beforeHandleLog(Log sysLog, ProceedingJoinPoint joinPoint, SysOperLog sysOperLog) {

        // 设置操作模块名称和操作类行(全是注解里面的value配置)
        sysOperLog.setTitle(sysLog.title());
        sysOperLog.setOperatorType(sysLog.operatorType().name());

        // 获取目标方法信息(根据aop方法里面的joinPoint)
        final MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        final Method method = methodSignature.getMethod();
        sysOperLog.setMethod(method.getName());     // ex:com.iron.spzx.controller.SysRoleController

        // 获取请求参数相关信息(根据RequestContextHolder)
        final ServletRequestAttributes requestAttributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        final HttpServletRequest request = requestAttributes.getRequest();
        sysOperLog.setRequestMethod(request.getMethod());   // GET POST PUT DELETE
        sysOperLog.setOperUrl(request.getRequestURI());     // /admin/system/sysRole/updateById
        sysOperLog.setOperIp(request.getRemoteAddr());      // 117.173.208.34

        // 设置请求请求体(根据注解配置是否保存请求参数:默认设置为true，而且只有POST， PUT方法才带有请求体)
        if (sysLog.isSaveRequestData()) {

            final String requestMethod = sysOperLog.getRequestMethod();
            if (HttpMethod.POST.name().equals(requestMethod) || HttpMethod.PUT.name().equals(requestMethod)) {
                // 判断是否是 post or put 才带有请求体

                final String params = Arrays.toString(joinPoint.getArgs());
                sysOperLog.setOperParam(params);
            }
        }

        // 设置用户名称(从threadLocal中获取用户名称)
        if (ThreadContextUtil.get() != null ){
            // 排除登录操作

            sysOperLog.setOperName(ThreadContextUtil.get().getName());
        }

    }

    /**
     * 日志上传之后的处理(成功或者失败的处理)
     * @param sysLog    自定义的注解类Log
     * @param proceed   当前方法的线,程通过 joinPoint.proceed 获得
     * @param sysOperLog sys_oper_log 实体类
     * @param status    0：正常 1：异常
     * @param errorMsg  错误信息
     */
    public static void afterHandleLog(Log sysLog, Object proceed, SysOperLog sysOperLog, int status , String errorMsg) {

        if (sysLog.isSaveResponseData()) {

            sysOperLog.setJsonResult(JSON.toJSONString(proceed));
        }

        sysOperLog.setStatus(status);
        sysOperLog.setErrorMsg(errorMsg);
    }
}
```



## 6. SpringMVC拦截器实现登录认证

检查是否登录(请求头中是否包含token)， 以及是否登录信息过期(查询redis中的token是否过期)。

**自定义拦截器：**

``` java
@Component
public class LoginAuthInterceptor implements HandlerInterceptor {

    @Resource
    RedisTemplate redisTemplate;

    /**
     * 放行OPTIONS操作， 查询是否带有token，通过查询是否带有token实现登录拦截和过期验证，将用户存入线程
     * @param request
     * @param response
     * @param handler
     * @return
     * @throws Exception
     */
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

        // 放过为 OPTIONS 的预请求
        final String method = request.getMethod();
        if ("OPTIONS".equals(method)) {

            return true;
        }

        // 根据token判断用户是登录或者是否过期
        final String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {

            response.setContentType("application/json;charset=utf-8");
            response.getWriter().println(JSON.toJSON(Result.build(null, ResultCodeEnum.LOGIN_AUTH)));
            return false;
        }
        final Object sysObject = redisTemplate.opsForValue().get(RedisKeyHeader.userLogin + token);

        if (sysObject == null) {

            response.setContentType("application/json;charset=utf-8");
            response.getWriter().println(JSON.toJSON(Result.build(null, ResultCodeEnum.LOGIN_AUTH)));
            return false;
        }

        final SysUser sysUser = JSON.parseObject(sysObject.toString(), SysUser.class);
        ThreadContextUtil.set(sysUser);
        return true;
    }

    /**
     * 释放线程资源
     * @param request
     * @param response
     * @param handler
     * @param ex
     * @throws Exception
     */
    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {

        ThreadContextUtil.remove();
    }

}
```

**配置：**

``` java
@Component
public class WebMvcConfiguration implements WebMvcConfigurer {

    @Autowired
    private UserAuthProperties userAuthProperties ;		// 注入实体类对象

    @Autowired
    private LoginAuthInterceptor loginAuthInterceptor ;

    /**
     * 配置拦截器：实现登录拦截功能
     * @param registry
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(loginAuthInterceptor)
                .excludePathPatterns(userAuthProperties.getNoAuthUrls())
                .excludePathPatterns("/favicon.ico","/swagger-resources/**", "/webjars/**", "/v3/**", "/swagger-ui.html/**", "/doc.html", "/device-width")
                .addPathPatterns("/**");
    }

    /**
     * 跨域
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")      // 添加路径规则
                .allowCredentials(true)               // 是否允许在跨域的情况下传递Cookie
                .allowedOriginPatterns("*")           // 允许请求来源的域规则
            	.allowedMethods("*")
                .allowedHeaders("*") ;                // 允许所有的请求头
    }
    
}
```

