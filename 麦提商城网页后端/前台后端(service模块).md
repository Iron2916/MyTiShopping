# 一.整体前台后端开发

**前台后端开发使用的是 微服务：Nacos + SpringCloud + GateWay(网关)**。



## 1. GateWay网关模块



### 1.1 实现了反向代理

**通过路由配置了对应的服务，并对外开放统一端口号进行这些服务的接口访问。**

``` yaml
server:
  port: 8503
```



### 1.2 实现负载均衡

**通过路由配置负载均衡。**

``` yaml
      routes: # 配置路由
        # 配置前台 service-product相关的配置
        - id: service-product
          uri: lb://service-product
          predicates:
            - Path=/*/product/**
        # 配置前台 service-user 相关配置
        - id: service-user
          uri: lb://service-user
          predicates:
            - Path=/*/user/**
        # 配置前台 service-cart 购物车相关配置
        - id: service-cart
          uri: lb://service-cart
          predicates:
            - Path=/api/order/cart/**
        # 配置前台 service-order 订单相关配置
        - id: service-order
          uri: lb://service-order
          predicates:
            - Path=/api/order/orderInfo/**
        # 配置前台 service-pay 支付模块
        - id: service-pay
          uri: lb://service-pay
          predicates:
            - Path=/api/order/alipay/**
```



### 1.3 统一配置跨域

**通过网关可以配置跨域，可以省略@Crossorigin注解。**

``` yaml
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOriginPatterns: "*"
            # 允许请求中携带的头信息
            allowedHeaders: "*"
            # 运行跨域的请求方式
            allowedMethods: "*"
            # 跨域检测的有效期,单位s
            maxAge: 36000
```



**完整代码：**

``` yaml
server:
  port: 8503

spring:
  application:
    name: spzx-server-gateway

  # redis：配置
  data:
    redis:
      host: 192.168.11.100
      port: 6379
      password: 111111

  # could 相关的设置
  cloud:
    nacos:
      discovery:
        server-addr: localhost:8848
    gateway:
      discovery:
        locator:
          enabled: true #启用通过服务发现自动配置路由。
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOriginPatterns: "*"
            # 允许请求中携带的头信息
            allowedHeaders: "*"
            # 运行跨域的请求方式
            allowedMethods: "*"
            # 跨域检测的有效期,单位s
            maxAge: 36000
      routes: # 配置路由
        # 配置前台 service-product相关的配置
        - id: service-product
          uri: lb://service-product
          predicates:
            - Path=/*/product/**
        # 配置前台 service-user 相关配置
        - id: service-user
          uri: lb://service-user
          predicates:
            - Path=/*/user/**
        # 配置前台 service-cart 购物车相关配置
        - id: service-cart
          uri: lb://service-cart
          predicates:
            - Path=/api/order/cart/**
        # 配置前台 service-order 订单相关配置
        - id: service-order
          uri: lb://service-order
          predicates:
            - Path=/api/order/orderInfo/**
        # 配置前台 service-pay 支付模块
        - id: service-pay
          uri: lb://service-pay
          predicates:
            - Path=/api/order/alipay/**
```



