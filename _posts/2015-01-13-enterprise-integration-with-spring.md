---
layout: post
title: '"Enterprise Integration with Spring" certification'
date: '2015-01-13T15:44:00.000+01:00'
author: Monik
tags:
- Programming
- Java
- Spring
modified_time: '2016-05-27T11:20:17.799+02:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-1069023866261926173
blogger_orig_url: http://learningmonik.blogspot.com/2015/01/enterprise-integration-with-spring.html
commentIssueId: 26
type: certification
---

<div class="bg-info panel-body" markdown="1">
These are my notes I took before taking the
<b>Enterprise Integration with Spring Certification </b>exam.<br/><br/>I passed the exam. At the second attempt, after actually taking those notes. The fist attempt was after 1-2 weeks of preparation and it was unnecessarily rushed (I knew it's too early, if you think it's too early it's probably too early), The most difficult thing in preparation for this exam was keeping all those different new things separate in my head and not mixing them up. As soon as I knew where I am in the imaginary table of contents, everything was clear. What helped in organising the knowledge was reading
<a href="http://learningmonik.blogspot.de/2015/01/spring-integration-in-action.html"
target="_blank">this book</a>.<br/><br/>There is some overlap of this exam with the first Spring Core exam. There is also some stuff that logically would belong to Spring Integration but is actually not part of the exam - the amount of material is simply too big to squeeze everything. That is why it is essential to read the official study guide and study according to it. Or to my notes below (which follow the guide) :P
</div>

### Remoting

<ol>
    <li style="font-weight: bold;">
        The concepts involved with Spring Remoting on both server- and client-side
    </li>
    <ul>
        <li>
            Exporters on server side, bind a service to registry, or expose an endpoint; no code change to the service
        </li>
        <li>
            <span>ProxyFactoryBeans on client side, which handle the communication and convert </span><span
                style="font-weight: bold; ">exceptions</span><span>; you inject the instance of service which in in fact a dynamic proxy (polymorphism)</span>
        </li>
    </ul>
    <li style="font-weight: bold;">
        The benefits of Spring Remoting over traditional remoting technologies
    </li>
    <ul>
        <li>
            Hide ‘plumbing’ code
        </li>
        <li>
            <span>Support multiple protocols in a </span><span
                style="font-weight: bold; ">consistent</span><span> way (normally it’s violation of concerns, business logic mixed with remoting infrastructure)</span>
        </li>
        <li>
            Configure and expose services declaratively (configuration-based approach)
        </li>
    </ul>
    <li style="font-weight: bold;">
        The remoting protocols supported by Spring
    </li>
    <ul>
        <li>
            RMI - uses RMI registry, Java serialisation
        </li>
        <li>
            <div>
                HttpInvoker - HTTP based (POST), Java serialisation
            </div>
        </li>
        <li>
            <div>
                Hessian / Burlap - HTTP based, binary/txt XML serialisation
            </div>
        </li>
        <li>
            Stateless EJB (not mentioned in the training)
        </li>
    </ul>
    <table style="margin-left:2em; margin-top:1em;"> <!-- The remoting protocols supported by Spring -->
        <tr>
            <td><br/></td>
            <td>
                Server side
            </td>
            <td>
                Client side
            </td>
        </tr>
        <tr style="height: 0px;">
            <td>
                RMI
            </td>
            <td>
                <div><span>&lt;bean class="</span><span
                        style=" font-weight: bold; ">RmiServiceExporter</span><span>"&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&lt;p:service-name value="myServiceNameInRegistry"/&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&lt;p:service-interface value="...TheService"/&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:service ref="myService"/&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:registry-port="1099"/&gt;</span>
                </div>
                <div><span>&lt;/bean&gt;</span>
                </div>
            </td>
            <td>
                <div><span>&lt;bean id, class="</span><span
                        style=" font-weight: bold; ">RmiProxyFactoryBean</span><span>"&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:service-interface value="myService"/&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&lt;p:service-url value="rmi://foo:1099/myServiceName</span><br/><span>InRegistry"/&gt;</span>
                </div>
                <div><span>&lt;/bean&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 0px;">
            <td>
                <div><span>Http</span><br/><span>Invoker</span>
                </div>
            </td>
            <td>
                <div><span>&lt;bean </span><span
                        style=" font-weight: bold; ">name="/transfer" </span><span>class="</span><span
                        style=" font-weight: bold; ">HttpInvokerServiceExporter</span><span>"&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&lt;p:service-interface value="...TheService"/&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:service ref="myService"/&gt;</span>
                </div>
                <div><span>&lt;/bean&gt;</span>
                </div>
                <br/>
                <div>
                    <span>+ DispatcherServlet or HttpRequestHandlerServlet with name ”</span><span
                        style=" font-weight: bold; ">transfer</span><span>”</span>
                </div>
            </td>
            <td>
                <div><span>&lt;bean id, class="</span><span
                        style=" font-weight: bold; ">HttpInvokerProxyFactoryBean</span><span>"&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:service-interface value="myService"/&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&lt;p:service-url value="rmi://foo:8080/services/transfer"/&gt;</span>
                </div>
                <div><span>&lt;/bean&gt;</span>
                </div>
            </td>
        </tr>
        <tr>
            <td>
                <div><span>Hessian / Burlap</span>
                </div>
            </td>
            <td colspan="2">
                <div>
                    <span>same as above, replace “HttpInvoker” with “Hessian” / “Burlap”</span>
                </div>
            </td>
        </tr>
    </table>
    <li
        style="font-weight: bold;">
        <div ><span>How Spring Remoting-based RMI is less invasive than plain RMI </span>
        </div>
    </li>
    <li
        style="font-weight: bold;">
        <div ><span>Spring HTTP Invoker: how client and server interact with each other </span>
        </div>
    </li>
</ol>

### Web Services

<ol>
    <li style="font-weight: bold;">
        How do Web Services compare to Remoting and Messaging
    </li>
    <ul>
        <li>
            information exchange protocol and format is HTTP and XML (or JSON) =&gt; no firewalls in between
        </li>
        <ul>
            <li>
                two ways of using the HTTP to transfer XML
            </li>
            <ul>
                <li style="list-style-type: circle; ">
                    SOAP/POX and WSDL/XSD - &nbsp;contract-first, they use only POST and/or GET method for all the operations
                </li>
                <li style="list-style-type: circle; ">
                    REST
                </li>
            </ul>
        </ul>
        <li>
            “loose coupling – we define document-oriented contract between service consumers and providers
        </li>
        <li>
            interoperability – XML payload (is understood by all major platforms like Java. NET, C++, Ruby, PHP, Perl,...)”
        </li>
    </ul>
    <li style="font-weight: bold;">
        The approach to building web services that Spring-WS supports
    </li>
    <ul>
        <li>
            is contract-first approach (start with XSD / WSDL)
        </li>
        <li>
            POX / SOAP + WSDL
        </li>
        <li>
            WebServiceClient - support for creating e.g. SOAP message
        </li>
    </ul>
    <table style="margin-left:2em; margin-top:1em;"> <!-- The approach to building web services that Spring-WS supports -->
        <tbody>
        <tr style="height: 27px;">
            <td><br/></td>
            <td colspan="2">
                <div><span>SOAP / POX (Spring WS)</span>
                </div>
            </td>
        </tr>
        <tr style="height: 27px;">
            <td>
                <div><span>web.xml</span>
                </div>
            </td>
            <td colspan="2">
                <div><span>&lt;servlet&gt;</span>
                </div>
                <div><span> &nbsp;&lt;servlet-name&gt;</span><span
                        style="font-weight: bold; ">si-ws-gateway</span><span>&lt;/servlet-name&gt;</span>
                </div>
                <div><span> &nbsp;&lt;servlet-class&gt;</span>
                </div>
                <div><span> &nbsp;&nbsp;&nbsp;MessageDispatcherServlet</span>
                </div>
                <div><span> &nbsp;&lt;/servlet-class&gt;</span>
                </div>
                <div><span> &nbsp;&lt;init-param&gt;</span>
                </div>
                <div>
                    <span> &nbsp;&nbsp;&nbsp;&lt;param-name&gt;contextConfigLocation&lt;/param-name&gt; &nbsp;&nbsp;&nbsp;</span>
                </div>
                <div><span> &nbsp;&nbsp;&nbsp;&lt;param-value&gt;si-ws-config.xml&lt;/param-value&gt;</span>
                </div>
                <div><span> &nbsp;&lt;/init-param&gt;</span>
                </div>
                <div><span> &nbsp;&lt;load-on-startup&gt;1&lt;/load-on-startup&gt;</span>
                </div>
                <div><span>&lt;/servlet&gt;</span>
                </div>
                <br/>
                <div><span>&lt;servlet-mapping&gt;</span>
                </div>
                <div><span> &nbsp;&lt;servlet-name&gt;</span><span
                        style="font-weight: bold; ">si-ws-gateway</span><span>&lt;/servlet-name&gt;</span>
                </div>
                <div><span> &nbsp;&lt;url-pattern&gt;/quoteservice&lt;/url-pattern&gt;</span>
                </div>
                <div><span>&lt;/servlet-mapping&gt;</span>
                </div>
                <br/>
                <div>
                    <span>* also add contextConfigLocation as context-param and ContextLoaderListener for app context</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td>
                <div><span>web infrastr. config</span>
                </div>
            </td>
            <td colspan="2">
                <div><span>&lt;bean class="....UriEndpointMapping"&gt;</span>
                </div>
                <div><span> &nbsp;&lt;p:name="defaultEndpoint" ref="</span><span
                        style="font-weight: bold; ">ws-inbound-gateway</span><span>"/&gt;</span>
                </div>
                <div><span>&lt;/bean&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td>
                <div><span>app config</span>
                </div>
            </td>
            <td colspan="2">
                <div><span>&lt;context:component-scan base-package=”transfers.ws”/&gt;</span>
                </div>
                <div><span>&lt;ws:annotation-driven/&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td>
                <div><span>Endpoint implementation</span>
                </div>
            </td>
            <td colspan="2">
                <div><span>@Endpoint</span>
                </div>
                <div><span>public class TransferServiceEndpoint {</span>
                </div>
                <div><span> &nbsp;...</span>
                </div>
                <div><span> &nbsp;@PayloadRoot(localPart=”transferRequest”, namespace=”</span><a
                        href="http://mybank.com/schemas/tr"
                        style="color: #009eb8; display: inline;  text-decoration: none; transition: color 0.3s;"><span
                        style="color: #1155cc;text-decoration: underline; ">http://mybank.com/schemas/tr</span></a><span>”</span>
                </div>
                <div>
                    <span> &nbsp;public @ResponsePayload TransferResponse newTransfer(@RequestPayload TransferRequest request){</span>
                </div>
                <div><span> &nbsp;&nbsp;&nbsp;...</span>
                </div>
                <div><span> &nbsp;}</span>
                </div>
                <div><span>}</span>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
    <ul style=" padding: 0px 0px 0px 2em;">
        <ul>
            <li >
                <div  style=" ">
                    <span><span>@PayloadRoot </span><span>defines the resource path, </span><span>@ResponsePayload </span><span>and </span><span>@RequestPayload </span><span>are for XML mapping</span></span>
                </div>
            </li>
        </ul>
    </ul>

<div markdown="1">

```xml
<int-ws:inbound-gateway id="ws-inbound-gateway"
                       request-channel="ws-requests"
                       extract-payload="false"
                      [marshaller/unmarshaller=”jaxb2”]/>
```
</div>
<li  style="font-weight: bold;">
    <div ><span>The Object-to-XML frameworks supported by Spring-OXM (or Spring 3.0) </span>
    </div>
</li>
<ul>
    <li >
        <div ><span>JAXB1/2, Castor, XMLBeans, JiBX</span>
        </div>
    </li>
    <li >
        <div ><span>XStream (not mentioned in training)</span>
        </div>
    </li>
    <li >
        <div ><span>also XPath argument binding</span>
        </div>
    </li>
</ul>

<div markdown="1">

```xml
<oxm:jaxb2-marshaller
   id=”marshaller”
   contextPath=”reward.ws.types:someotherpackage”/>
```

, or just simply

```xml
<ws:annotation-driven/> <!-- registers all infrastructure beans needed for annotation-based endpoints, like JAXB2 (un)marshalling-->
```
</div>
    <li  style="font-weight: bold;">
        <div ><span><span>The strategies supported to map requests to endpoints (?) </span><span
                style="font-weight: normal; ">(</span><a
                href="http://docs.spring.io/spring-ws/site/reference/html/server.html#server-endpoint-mapping"
                style="color: #009eb8; display: inline;  text-decoration: none;"><span
                style="color: #1155cc; font-weight: normal; text-decoration: underline; ">link</span></a><span
                style="font-weight: normal; ">)</span></span>
        </div>
    </li>
    <ul>
        <li >
            <div >
                <span><span>@PayloadRoot - on method level, requires </span><span>namespace</span><span>+</span><span>localPart</span><span> values, which build the URL qualifier; needs the </span><span>PayloadRootAnnotationMethodEndpointMapping</span><span> registered;</span></span>
            </div>
        </li>
        <li >
            <div ><span><span>SOAP Action Header - based on the </span><span>To </span><span>and </span><span>Action </span><span>SOAP headers, @SoapAction: on method level “</span><span
                    style="font-style: italic; ">Whenever a message comes in which has this SOAPAction header, the method will be invoked</span><span>.”</span></span>
            </div>
        </li>


<div markdown="1">

```xml
<SOAP-ENV::Header>
   ...
   <wsa:To S:mustUnderstand="true">http://example/com/fabrikam</wsa:To>
   <wsa:Action>http://example.com/fabrikam/mail/Delete</wsa:Action>
</SOAP-ENV:Header>
```
</div>
    <li >
        <div >
            <span><span>WS-Addressing, or AnnotationActionEndpointMapping, also AddressingEndpointInterceptor - annotate the handling methods with the</span><span> </span></span><span>@Action("http://samples/RequestOrder")</span><span> annotation</span>
        </div>
    </li>

<div markdown="1">

```java
@Action("http://samples/RequestOrder")
public Order getOrder(OrderRequest orderRequest) {
   return orderService.getOrder(orderRequest.getId());
}
```
</div>
        <li >
            <div  style=" ">
                <span>XPath - </span><span>@Namespace(prefix = "s", uri="http://samples")</span><span> annotation on class/method level, and</span><span><span> </span><span>@XPathParam("/s:orderRequest/@id") int orderId </span></span><span>in the method - the attribute will be given the value which is the evaluation of the XPath expression</span>
            </div>
        </li>

<div markdown="1">

```java
@PayloadRoot(localPart = "orderRequest", namespace = "http://samples")
@Namespace(prefix = "s", uri="http://samples")
public Order getOrder(@XPathParam("/s:orderRequest/@id") int orderId) {
   Order order = orderService.getOrder(orderId);
   // create Source from order and return it
}
```
</div>
            <li >
                <div ><span>Message Payload - e.g. @RequestPayload Element inside the method</span>
                </div>
            </li>
        </ul>
        <li  style="font-weight: bold;">
            <div ><span>Of these strategies, how does @PayloadRoot work exactly? </span>
            </div>
        </li>
        <ul>
            <li >
                <div ><span><span>it’s written above, but: </span><span
                        style="font-style: italic; ">“</span><span
                        style="font-style: italic; ">The PayloadRootAnnotationMethodEndpointMapping uses the @PayloadRoot annotation, with the localPart and namespace elements, to mark methods with a particular qualified name. Whenever a message comes in which has this qualified name for the payload root element, the method will be invoked.“</span></span>
                </div>
            </li>
        </ul>
        <li  style="font-weight: bold;">
            <div  >
                <span>The functionality offered by the WebServiceTemplate </span>
            </div>
        </li>
        <ul>
            <li >
                <div  >
                    <span>does the SOAP stupid stuff, and also POX</span>
                </div>
            </li>
            <li >
                <div  >
                    <span>works with marshallers / unmarshallers (set the “marshaller” and “unmarshaller” propperty)</span>
                </div>
            </li>
            <li >
                <div  >
                    <span>convenience methods</span>
                </div>
            </li>
            <li >
                <div  >
                    <span>callbacks</span>
                </div>
            </li>
            <li >
                <div  >
                    <span>error handling (annotate method with </span><span>@SoapFault(faultCode=FaultCode.CLIENT)</span><span>, </span><span>SoapFaultMessageResolver </span><span>is default)</span>
                </div>
            </li>

</ul>

<div markdown="1">

```xml
<bean class=”...WebServiceTemplate”>
  <property name=”defaultUri” value=”http://mybank.com/transfer”/>
  <property name=”marshaller” ref=”marshallerAndUnmarshaller”/>
  <property name=”unmarshaller” ref=”marshallerAndUnmarshaller”/>
  <property name=”faultMessageResolver” ref=”myCustomFaultMessageResolver”/>
</bean>

<bean id=”marshallerAndUnmarshaller” class=”...CastorMarshaller”>
  <property name=”mappingLocation” value=”classpath:castor-mapping.xml”/>
</bean>

template.marshallSendAndReceive(new TransferRequest(“S123”));
template.sendSourceAndReceiveToResult(source, result);

full definition, e.g.:
doSendAndReceive(MessageContext messageContext, WebServiceConnection connection, WebServiceMessageCallback requestCallback, WebServiceMessageExtractor<T> responseExtractor)
```
</div>
        <ul>
            <li >
                <div  style=" ">
                    <span>the template by default uses Java's </span><span>HttpUrlConnectionMessageSender</span><span>, if you wanna apache client, override "messageSender" with </span><span>HttpComponentsMessageSender</span>
                </div>
            </li>
            <li >
                <div ><span><span>it’s also possible to use </span><span>JmsMessageSender</span></span>
                </div>
            </li>
        </ul>
        <li  style="font-weight: bold;">
            <div
                 style=" "><span><span>The underlying WS-Security implementations supported by Spring-WS (</span><a
                    href="http://docs.spring.io/spring-ws/docs/2.2.0.RELEASE/reference/htmlsingle/#security"
                    style="color: #009eb8; display: inline;  text-decoration: none; transition: color 0.3s;"><span
                    style="color: #1155cc; text-decoration: underline; ">link</span></a><span>)</span></span>
            </div>
        </li>
        <ul>
            <li >
                <div ><span>are implemented as interceptors</span>
                </div>
            </li>
            <li >
                <div >
                    <span><span>XwsSecurityInterceptor </span><span>(requires Sun JVM and SAAJ) - requires security policy XML configuration file</span></span>
                </div>
            </li>
            <ul>
                <li >
                    <div >
                        <span>Wss4jSecurityInterceptor </span><span>(also supports non-Sun JVMs and Axiom)</span>
                    </div>
                </li>
                <li >
                    <div ><span>support for Spring Security and JAAS keystores (JAAS goes with wss)</span>
                    </div>
                </li>
            </ul>
            <li >
                <div ><span>also client-side interceptors, which are injected in the WebServiceTemplate</span>
                </div>
            </li>
            <li >
                <div ><span>supports: authentication, digital signatures, encryption and decryption</span>
                </div>
            </li>
            <li >
                <div >
                    <span>exception handling: </span><span>WsSecuritySecurementException </span><span>(just logs), </span><span>WsSecurityValidationException </span><span>(translated to SOAP Fault)</span>
                </div>
            </li>
</ul>

<div markdown="1">

```xml
<ws:interceptors>
 <bean class=”blabla.SoapEnvelopeLoggingInterceptor”
</ws:interceptors>
```

or

```xml
<ws:interceptors>
 <ws:payloadRoot localPart=”MyRequest” namespaceUri=”htpp://blabla.com/namespace”>
    <bean class=”blabla.SoapEnvelopeLoggingInterceptor”
 </ws:payloadRoot>
</ws:interceptors>
```

client-side:

```xml
<bean class=”org...WebServiceTemplate”>
 <property name=”interceptors”>
   <bean class=”blablabalInterceptor”
 </property>
</bean>
```
</div>
        <li  style="font-weight: bold;">
            <div  style=" ">
                <span>How key stores are supported by Spring-WS for use with WS-Security (?)</span>
            </div>
        </li>
        <ul>
            <li >
                <div >
                    <span><span>in Java, the keystores are of type</span><span> </span></span><span>java.security.KeyStore</span><span> and they store:</span>
                </div>
            </li>
            <ul>
                <li >
                    <div ><span>private keys</span>
                    </div>
                </li>
                <li >
                    <div ><span>symmetric keys</span>
                    </div>
                </li>
                <li >
                    <div ><span>trusted certificates</span>
                    </div>
                </li>
            </ul>
            <li >
                <div >
                    <span>Spring provides </span><span>KeyStoreFactoryBean</span><span><span> </span><span>and </span></span><span>KeyStoreCallbackHandler</span>
                </div>
            </li>


<div markdown="1">

```xml
<bean id="keyStore" class="org.springframework.ws.soap.security.support.KeyStoreFactoryBean">
    <property name="password" value="password"/>
    <property name="location" value="classpath:org/springframework/ws/soap/security/xwss/test-keystore.jks"/>
</bean>

<bean id="keyStoreHandler" class="org.springframework.ws.soap.security.xwss.callback.KeyStoreCallbackHandler">
    <property name="keyStore" ref="keyStore"/>
    <property name="privateKeyPassword" value="changeit"/>
</bean>
```

```xml
<bean id="wsSecurityInterceptor"
    class="org.springframework.ws.soap.security.xwss.XwsSecurityInterceptor">
    <property name="policyConfiguration" value="classpath:securityPolicy.xml"/>
    <property name="callbackHandlers">
        <list>
            <ref bean="keyStoreHandler"/>
            <ref bean="...
        </list>
    </property>
</bean>
```
</div>
 </ul>
</ol>

### RESTful services with Spring-MVC

<ol>
    <li style="font-weight: bold;">
        The main REST principles
    </li>
    <ul>
        <li>
            <div><span>(makes HTTP not only transport protocol, but also application protocol)</span>
            </div>
        </li>
        <li>
            <div><span><span>H </span><span>Hypermedia (links)</span></span>
            </div>
        </li>
        <li>
            <div><span><span>U </span><span>Uniform Interface (nouns for resources, verbs for operations: GET, POST, PUT, DELETE, HEAD, OPTIONS)</span></span>
            </div>
        </li>
        <li>
            <div><span><span>S </span><span>Stateless Conversation =&gt; scalable</span></span>
            </div>
        </li>
        <li>
            <div><span><span>I </span><span>Identifiable Resources</span></span>
            </div>
        </li>
        <li>
            <div><span><span>R </span><span>Resource Representations (multiple representations for resource, which is abstract; Accept header in req, Content-Type in res)</span></span>
            </div>
        </li>
        <table style="margin-left:2em; margin-top:1em;"> <!-- The main REST principles -->
            <tbody>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; font-weight: bold; ">Method</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <span style="font-family: &quot;arial&quot;; font-weight: bold; ">Safe (no side effects)</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">
                        <span style="font-family: &quot;arial&quot;; font-weight: bold; ">Indepotent</span>
                    </div>
                </td>
                <td>
                    <div style=" "><span style="font-family: &quot;arial&quot;; font-weight: bold; ">Comments</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; ">GET</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td>
                    <div style=" "><span
                            style="font-family: &quot;arial&quot;; ">Is cacheable (ETag) or Last-Modified, 304</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; ">HEAD</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td><br/></td>
            </tr>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; ">POST</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">n
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">n
                    </div>
                </td>
                <td>
                    <div style=" "><span style="font-family: &quot;arial&quot;; ">Location header in response</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; ">PUT</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">n
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td>
                    <div style=" "><span style="font-family: &quot;arial&quot;; ">Create OR update</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 0px;">
                <td>
                    <div style="text-align: right;">
                        <span style="font-family: &quot;arial&quot;; ">DELETE</span>
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">n
                    </div>
                </td>
                <td>
                    <div style="text-align: center;">y
                    </div>
                </td>
                <td><br/></td>
            </tr>
            </tbody>
        </table>
    </ul>
    <li style="font-family: Arial; font-weight: bold;">
        <div><span>REST support in Spring-MVC </span>
        </div>
    </li>
    <ul>
        <table style="margin-left:2em; margin-top:1em;"> <!-- REST support in Spring-MVC -->
            <tbody>
            <tr style="height: 27px;">
                <td><br/></td>
                <td colspan="2">
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">SOAP / POX (Spring WS)</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 27px;">
                <td>
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">web.xml</span>
                    </div>
                </td>
                <td colspan="2">
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;servlet&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&lt;servlet-name&gt;http-ws-gateway&lt;/servlet-name&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&lt;servlet-class&gt;</span><span
                            style="color: #333333; font-family: &quot;courier new&quot;; font-weight: bold; ">HttpRequestHandlerServlet</span><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;/servlet-class&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&lt;init-param&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;&nbsp;&lt;param-name&gt;contextConfigLocation&lt;/param-  name&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;&nbsp;&lt;param-value&gt;http-ws-gateway.xml&lt;/param-value&gt;</span>
                    </div>
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;/servlet&gt;</span>
                    </div>
                    <br/>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;servlet-mapping&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&lt;servlet-name&gt;http-ws-gateway&lt;/servlet-name&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&lt;url-pattern&gt;/httpquote&lt;/url-pattern&gt;</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;/servlet-mapping&gt;</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 28px;">
                <td>
                    <div style=" "><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">web infrastr. config</span>
                    </div>
                </td>
                <td colspan="2">
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">&lt;int-http:inbound-gateway </span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;id="http-inbound-gateway"</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;request-channel="http-request"</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;reply-channel="http-response"</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;extract-reply-payload="false"</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;view-name="about"</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;reply-key, reply-timeout,message-converters, </span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;supported-methods, convert-exceptions, </span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;request-payload-type, error-code, errors-key,</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;header-mapper, name/&gt;</span>
                    </div>
                    <br/>
                    <ul style=" padding: 0px 0px 0px 2em;">
                        <li style="color: #333333; font-family: Arial;    ">
                            <div><span>name - e.g. "/subscribe", so that it allows it to be used with DispatcherServlet</span>
                            </div>
                        </li>
                        <li style="color: #333333; font-family: Arial;    ">
                            <div><span>view-name - is the Spring MVC view name</span>
                            </div>
                        </li>
                        <li style="color: #333333; font-family: Arial;    ">
                            <div><span>you can also use inbound-message-adapter if you don't need two way communication, it uses MessageTemplate</span>
                            </div>
                        </li>
                    </ul>
                </td>
            </tr>
            <tr style="height: 28px;">
                <td>
                    <div style=" "><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">app config</span>
                    </div>
                </td>
                <td colspan="2">
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">N/A</span>
                    </div>
                </td>
            </tr>
            <tr style="height: 28px;">
                <td>
                    <div style=" "><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">Endpoint implementation</span>
                    </div>
                </td>
                <td colspan="2">
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">@Controller</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">@RequestMapping(“/rewards”)</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; ">public class Blabla{</span>
                    </div>
                    <br/>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;@RequestMapping(value=”/{number}”, method=GET)</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;public String Reward blabla(@RequestBody someObject / Model model, @PathVariable(“number”) String number){</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;// ...</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;// return view name</span>
                    </div>
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;}</span>
                    </div>
                    <br/>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;@RequestMapping(method=POST)</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;@ResponseStatus(HttpStatus.CREATED)</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;public @ResponseBody Reward blabla(@RequestBody someObject, HttpServletResponse res){</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;// ...</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;res.addHeader(“Location”, getMeUrl(order.getId()));</span>
                    </div>
                    <div><span
                            style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;&nbsp;&nbsp;// return the object, will be mapped because of @ResponseBody, by converter based on Accept header</span>
                    </div>
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; "> &nbsp;}</span>
                    </div>
                    <div><span style="color: #333333; font-family: &quot;courier new&quot;; ">}</span>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
        <li>
            <div style=" "><span>you can also add e.g. </span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">@ResponseStatus(value=HttpStatus.CONFLICT)</span><span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;"> </span><span>on your Exception class, to have the exception mapped</span></span>
            </div>
        </li>
        <li>
            <div><span>alternatively to the above, in your controller you can add an empty void method annotated with </span><span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">@ExceptionHandler(value=YourException.class)</span><span> </span></span><span>and </span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">@ResponseStatus(value=HttpStatus.NOT_FOUND)</span>
            </div>
        </li>

<div markdown="1">

```xml
<int-http:outbound-gateway
   url="http://blblah"
   request-channel="requests"
   http-method="GET"
   expected-response-type="java.lang.String">
     <int-http:uri-variable
       name="location"
       expression="payload"/>
</int:http:outbound-gateway>
```
  - you can use outbound-channel-adapter if you don't need two way communication, it uses RestTemplate;
  - in the case above it's better to override the error handler, as the default one treats only 4** and 5** responses as errors
</div>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >Spring-MVC is an alternative to JAX-RS, not an implementation </span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  style=" ">
                    <span >got it ;)</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >The @RequestMapping annotation, including URI template support </span>
            </div>
        </li>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >The @RequestBody and @ResponseBody annotations </span>
            </div>
        </li>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >The functionality offered by the RestTemplate</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >for client side</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >has default </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">HttpMessageConverters </span><span
                        >(same like on server), supports URI templates</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            >e.g. </span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">Jaxb2RootElementHttpMessageConverter</span><span
                            ><span
                            >, register it with</span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;"> </span></span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">&lt;mvc:annotation-driven/&gt;</span><span
                            > !</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            >it can also use external configuration, e.g. Apache Commons HTTP Client (set the “</span><span
                            >requestFactory</span><span
                            >” property to </span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">CommonsCliemtHttpRequestFactory</span>
                    </div>
                </li>
            </ul>
            <li
                >
                <div  ><span
                        ><span
                        >HttpEntity </span><span
                        >represents request or response (payload + headers)</span></span>
                </div>
            </li>
        </ul>

<div markdown="1">

```java
<T> T getForObject(URIurl, Class<T>responseType) throws RestClientException; ← returns the object from GET
<T> T getForObject(Stringurl, Class<T>responseType, Object... uriVariables)throwsRestClientException;
<T> T getForObject(Stringurl, Class<T>responseType, Map<String, ?>uriVariables)throwsRestClientException;

<T> ResponseEntity<T> getForEntity(URI url, Class<T> responseType)
  throws RestClientException; ← returns the whole response from GET (with headers)

void put(String url, Object request, Object...uriVariables) throws RestClientException;

void delete(String url, Map<String, ?>uriVariables) throws RestClientException;

<T> T postForObject(String url,Object request,Class<T> responseType, Object… uriVariables) throws RestClientException;

<T> ResponseEntity <T> postForEntity(String url, Object request, Class<T> resType, Object...uriVariables)
  throws RestClientException;

* URI url=response.getHeaders().getLocation(); ← to get location of the new resource!

<T> T execute()

<T> ResponseEntity <T> exchange(String url, HttpMethod method, HttpEntity<?> reqEntity, Class<T> resType, Object... uriVariables)
  throws RestClientException;
```
</div>
</ul>
</ol>

### JMS with Spring

<ol>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >Where can Spring-JMS applications obtain their JMS resources from </span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >either create manually (standalone), or obtain from JNDI:</span>
                </div>
            </li>
        </ul>
    <table style="margin-left:2em; margin-top:1em;" ><!-- Where can Spring-JMS applications obtain their JMS resources from -->
        <tbody>
        <tr style="height: 28px;">
            <td rowspan="2" >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">Destination</span>
                </div>
            </td>
            <td >
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">&lt;bean id=”orderQueue” class=”org.apache.activemq...ActiveMQQueue”&gt;</span><span
                        style="font-family: &quot;courier new&quot;; "><br
                        class="kix-line-break"/></span><span
                        style="font-family: &quot;courier new&quot;; "> &nbsp;&lt;constructor-arg value=”queue.orders”/&gt;</span><span
                        style="font-family: &quot;courier new&quot;; "><br
                        class="kix-line-break"/></span><span
                        style="font-family: &quot;courier new&quot;; ">&lt;/bean&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">&lt;jee:jndi-lookup id=”orderQueue” jndi-name=”jms/OrderQueue”/&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td rowspan="2" >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">ConnectionFactory</span>
                </div>
            </td>
            <td >
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">&lt;bean id=”cf” class=”org.apache.activemq.ActiveMQConnectionFactory”&gt;</span><span
                        style="font-family: &quot;courier new&quot;; "><br
                        class="kix-line-break"/></span><span
                        style="font-family: &quot;courier new&quot;; "> &nbsp;&lt;property name=”brokerURL” value=”tc[://localhost:61616”/&gt;</span><span
                        style="font-family: &quot;courier new&quot;; "><br
                        class="kix-line-break"/></span><span
                        style="font-family: &quot;courier new&quot;; ">&lt;/bean&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">&lt;jee:jndi lookup id=”cf” jndi-name=”jms/ConnectionFactory”/&gt;</span>
                </div>
            </td>
        </tr>
        <tr style="height: 0px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">Connection</span>
                </div>
            </td>
            <td >
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">connectionFactory.createConnection();</span>
                </div>
            </td>
        </tr>
        <tr style="height: 0px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">Session</span>
                </div>
            </td>
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">created from the </span><span
                        style="font-family: &quot;courier new&quot;; ">Connection</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">JMS Message</span>
                </div>
            </td>
            <td rowspan="3" >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">created from </span><span
                        style="font-family: &quot;courier new&quot;; ">Session</span>
                </div>
                <br/>
                <div  style=" "><span
                        style="font-family: &quot;courier new&quot;; ">session.createProducer(destination);</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">MessageProducer</span>
                </div>
            </td>
        </tr>
        <tr style="height: 28px;">
            <td >
                <div  style=" "><span
                        style="font-family: &quot;arial&quot;; ">MessageConsumer</span>
                </div>
            </td>
        </tr>
        </tbody>
    </table>
        <li
            style="font-weight: bold;">
            <div  style=" "><span
                    >The functionality offered by Spring's JMS message listener container, including the use of a MessageListenerAdapter through the 'method' attribute in the &lt;jms:listener/&gt; element</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ">
                    <span >MessageListener an interface for asynchronous reception of messages; one method: </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">void onMessage(Message)</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >implement MessageListener, or </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">SessionAwareMessageListener </span><span
                        >(extends MessageListener)</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >requires a listener container - in the past EJB container, now</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">SimpleMessageListenerContainer </span><span
                            >- fixed number of sessions</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">DefaultMessageListenerContainer </span><span
                            >- adds transactional capability</span>
                    </div>
                </li>
            </ul>
        </ul>

<div markdown="1">

```xml
<jms:listener-container connection-factory=”cf”>
<jms:listener destination=”queue.orders”
              ref=”myListener
              (method=”order”)
              (response-destination=”queue.confirmation”)/>
</jms:listener-container>
```

</div>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >The functionality offered by the JmsTemplate</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >converts exceptions to unchecked</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >convenience methods</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >needs reference to </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">ConnectionFactory</span><span
                        >, optionally set defaultDestination property</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            >use </span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">CachingConnectionFactory </span><span
                            ><span
                            >wrapper around the </span><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">ActiveMQConnectionFactory</span><span
                            >, as JmsTemplate aggresively opens and closes and reopens JMS resources</span></span>
                    </div>
                </li>
            </ul>
            <li
                >
                <div  ><span
                        >uses</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            ><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">MessageConverter </span><span
                            >(default </span></span><span
                            >SimpleMessageConverter</span><span
                            > - handles String, Serializable, Map, byte[]) - from/to Message</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">DestinationResolver </span><span
                            >(</span><span
                            >default </span><span
                            >DynamicDestinationResolver, JndiDestinationResolver)</span><span
                            >- from String to Destination</span>
                    </div>
                </li>
            </ul>
        </ul>

<div markdown="1">

```java
void convertAndSend([String/Destination d,] Object m)
void convertAndSend(Object m, MessagePostProcessor mpp) // to do stuff to the message after it has been converted
void send(MessageCreator mc) // is used inside convertAndSend()

Object execute(ProducerCallback<T> action)
Object execute(SessionCallback<T> action)

Message receive([String/Destination d,])
Object receiveAndConvert(destination)
```
</div>
</ol>

### Transactions

<ol >
        <li
            style="font-weight: bold;">
            <div  ><span
                    >Local JMS Transactions with Spring</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >acknowledge mode - not transactions </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">connection.createSession(transacted=false, acknowledgeMode)</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            >AUTO_ACKNOWLEDGE (default) =&gt; calling .receive() or onMessage() = removing message from the queue</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            >CLIENT_ACKNOWLEDGE =&gt; client must call message.acknowledge(), and this one call will remove all messages since last time! (which are bound to the same session). And client can also call session.recover() to have redelivery of those messages (can be duplicates)</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            >DUPS_OK_ACKNOWLEDGE =&gt; like auto but lazily, once every few times</span>
                    </div>
                </li>
            </ul>
            <li
                >
                <div  ><span
                        ><span
                        >transacted session -</span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;"> </span></span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">connection.createSession(transacted=true, null)</span>
                </div>
            </li>
            <ul >
                <li
                    >
                    <div  ><span
                            >starts local JMS when no managed JMS or JTA transaction is in progress; will be synchronised with existing local transaction</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            >transaction starts, when message is received</span>
                    </div>
                </li>
                <li
                    >
                    <div  ><span
                            >if a message fails, it will be put back on the queue</span>
                    </div>
                </li>
            </ul>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >How to enable local JMS transactions with Spring's message listener container</span>
            </div>
        </li>


<div markdown="1">

```xml
<jms:listener-container acknowledge=”auto|client|dups_ok|transacted”/>
```

or

```xml
<jms:listener-container transaction-manager=”tm”/>
```

```java
connection.createSession(transacted=true, acknowledgeMode);
session.commit();
session.rollback();
```
</div>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >If and if so, how is a local JMS transaction made available to the JmsTemplate</span>
            </div>
        </li>
<ul>
<div markdown="1">

```xml
<bean class=”..JmsTemplate>
   (<property name=”sessionAcknowledgeMode” value=”...”/>)
   <property name=”sessionTransacted” value=”true”/>
</bean>
```

</div>
            <li
                >
                <div  style=" ">
                    <span >jmsTemplate will automatically use same session (</span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">ConnectionFactoryUtils.doGetTransactionalSession()</span><span
                        >), so the above settings are ignored in case the session was created within an active transaction already</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >How does Spring attempt to synchronize a local JMS transaction and a local database transaction (?)</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >Commit database before JMS (can end up with duplicates), and at the end</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >Put commits close together</span>
                </div>
            </li>
            <li
                >
                <div  style=" "><span
                        >only as last resort use XA</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >The functionality offered by the JmsTransactionManager (?)</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  >
                    <span style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">JmsTransactionManager</span><span
                        ><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;"> </span><span
                        >or </span></span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">DataSourceTransactionManager </span><span
                        >are both implementations of </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">PlatformTransactionManager</span>
                </div>
            </li>
            <li
                >
                <div  >
                        <span ><span
                                >“Performs local resource transactions, binding a JMS Connection/Session pair from the specified </span><span
                                >ConnectionFactory </span><span
                                >to the thread</span></span>
                </div>
            </li>
            <li
                >
                <div  >
                    <span >The </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">JmsTemplate </span><span
                        >auto-detects an attached thread and participates automatically with Session</span>
                </div>
            </li>
            <li
                >
                <div  >
                        <span><span
                                >The </span><span
                                style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">JmsTransationManager </span><span
                                >allows a </span></span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">CachingConnectionFactory </span><span
                        >that uses a single connection for all JMS access (performance gains). All Sessions belong to the same connection”</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >What guarantees does JTA provide that local transactions do not provide</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  >
                    <span >once-and-once-only delivery</span>
                </div>
            </li>
            <li
                >
                <div  >
                    <span >ACID with multiple resources</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >How to switch from local to global JTA transactions</span>
            </div>
        </li>


<div markdown="1">

    <jms:listener-container transaction-manager=”transactionManager” ../>

</div><ul>
            <li
                >
                <div  >
                    <span >you also may have to reconfigure some resources like Hibernate</span>
                </div>
            </li>
        </ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >Where can you obtain a JTA transaction manager from</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  style=" ">
                    <span >within J2EE server:</span>
                </div>
            </li>


<div markdown="1">

```xml
<tx:jta-transaction-manager/>

<jee:jndi-lookup id=”dataSource” jndi-name=”java:comp/env/jdbc/myDS”/>
<jee:jndi-lookup id=”connectionFactory” jndi-name=”java:comp/env/jdbc/myConnFac”/>
```
</div>
        <li
            >
            <div  style=" "><span
                    >standalone definition:</span>
            </div>
        </li>


<div markdown="1">

```xml
<bean id=”transactionManager” class=”org….JtaTransactionManager”>
 <property name=”transactionManager” ref=”jtaTxMgr”/>
 <property name=”userTransaction” ref=”userTx”/>
</bean>
```
</div>
        <li
            style="font-family: Arial;    ">
            <div  ><span
                    >this class is provided by Spring, but it only integrates with external JTA TX manager (e.g. Atomikos was used in course)</span>
            </div>
        </li>
        <li
            style="font-family: Arial;    ">
            <div  ><span
                    >the externally provided transactionManager and userTransaction resources have to be of type “XA aware”</span>
            </div>
        </li>

</ul>
</ol>

### Batch processing with Spring Batch

<ol >
    <li
        style="font-family: Arial; font-weight: bold;">
        <div  ><span
                >Main concepts (Job, Step, Job Instance, Job Execution, Step Execution, etc.) </span>
        </div>
    </li>
    <ul >
        <li
            style="font-family: Arial;    ">
            <div  ><span
                    >easy, see also </span><a
                    href="https://docs.google.com/document/d/1Bk3cR5GoH-yMURSaZH47FSBawiAaY68BFsYiOlPzTms/edit#"
                    style="color: #009eb8; display: inline;  text-decoration: none; transition: color 0.3s;"><span
                    style="color: #1155cc; font-family: &quot;arial&quot;; text-decoration: underline; ">here</span></a>
            </div>
        </li>
        <li
            style="font-family: Arial;    ">
            <div  ><span
                    >job execution has status, but job instance (job+parameters) also has a status, the “overall status”</span>
            </div>
        </li>


<div markdown="1">

```xml
<job id="resendUnprocessedDinings">
 <step id="processConfirmationsStep" next="sendUnprocessedDiningsStep">
   <tasklet>
     <chunk reader="confirmationReader"
            writer="confirmationUpdater"
            commit-interval="${chunk.size}"
            reader-transactional-queue="true"/>
   </tasklet>
 </step>
</job>
```
</div></ul>
<li style="font-weight: bold;">
    <div><span>The interfaces typically used to implement a chunk-oriented Step</span>
    </div>
</li>
<ul>
    <li>
        <div><span>Step for one chunk goes like this:</span>
        </div>
    </li>
    <ul>
        <li>
            <div><span><span>ItemReader, </span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">&nbsp;</span></span><span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">ItemReader&lt;Dining&gt;</span><span>,</span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;"> public Dining read(){}</span></span>
            </div>
        </li>
        <li>
            <div><span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">ItemProcessor </span><span>(optional), </span></span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">ItemProcessor&lt;XMLDining, Dining&gt;</span><span>, </span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">public Dining process(XMLDining bla){}</span>
            </div>
        </li>
        <li>
            <div><span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace;">ItemWriter</span><span>, </span></span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">ItemWriter&lt;Dining&gt;</span><span>,</span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; "> public write(List&lt;? extends Dining&gt; dinings){}</span>
            </div>
        </li>


<div markdown="1">

```xml
<bean id="itemReader" class="....FlatFileItemReader" scope="step">
 <property name="resource" value="file://#{jobParameters['filena']}"/>
 <property name="lineMapper">
   <bean class="....DefaultLineMapper">
     <property name="lineTokenizer">
       <bean class="....DelimitedLineTokenizer">
         <property name="names" value="source,dest,amount,date"/>
       </bean>
     </property>
     <property name="fieldSetMapper" ref=”myMapper”/>
   </bean>
 </property>
</bean>

<bean id="itemWriter" class="....FlatFileItemWriter" scope="step">
 <property name=”fieldSetCreator” ref=”customCreator”/>
 ...
</bean>
```
</div></ul></ul>
<li style="font-weight: bold;">
    <div><span>How and where state can be stored</span>
    </div>
</li>
<ul>
    <li>
        <div><span>in </span><span
                style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">JobRepository</span>
        </div>
    </li>
    <ul>
        <li>
            <div><span>it can use database or in &nbsp;memory map</span>
            </div>
        </li>
        <li>
            <div><span>persists &nbsp;jobs’ metadata and intermediate state of execution (=job instance and job execution)</span>
            </div>
        </li>

    </ul>

<div markdown="1">

```xml
<batch:job-repository id=”jobRepository”/>
```

, or

```xml
<batch:job-repository
       data-source="dataSource"
       id="jobRepository"
       transaction-manager="transactionManager"
       table-prefix="BATCH_"/>
```
</div>
<li style="font-family: Arial;    ">
    <div>
        <span>JobLauncher creates JobExecution entity in the JobRepository, next it executes the job, and returns the result</span>
    </div>
</li>
<li style="font-family: Arial;    ">
    <div><span>JobLauncher is already wrapped in </span><span
            style="font-family: &quot;courier new&quot;; ">CommandLineJobRunner</span><span>, if you wanna use it</span>
    </div>
</li>
<li style="font-family: Arial;    ">
    <div><span style="font-family: &quot;courier new&quot;; ">jobLauncher.run(job, parameters)</span>
    </div>
</li>

<div markdown="1">

```xml
<bean id="jobLauncher" class="....SimpleJobLauncher">
  <property name="jobRepository" ref="jobRepository"/>
</bean>
```
</div></ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >What are job parameters and how are they used</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >they identify the job instance, same instance cannot be run twice thats why add there some counter</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >in case same job instance is attempted to be re-launched you will get </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">JobInstanceAlreadyCompletedException</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >you create it programmatically using builder: &nbsp;</span>
                </div>
            </li>


<div markdown="1">

```java
JobParametersBuilder jpb = new JobParametersBuilder();
jpb.addString('filena', 'payment.xml');
JobExecution execution = jobLauncher.run(job, jpb.toJobParameters());
```
</div></ul>
        <li
            style="font-weight: bold;">
            <div  ><span
                    >What is a FieldSetMapper and what is it used for</span>
            </div>
        </li>
        <ul >
            <li
                >
                <div  ><span
                        >FieldSetMapper&lt;T&gt; → T mapFieldSet(FieldSet fs)</span>
                </div>
            </li>
            <li
                >
                <div  ><span
                        >used by e.g. LineMapper (e.g. </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">DefaultLineMapper</span><span
                        >), which is used by </span><span
                        style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">FlatFileItemReader</span>
                </div>
            </li>


<div markdown="1">

```java
Date date = fs.readDate(0,"dd/MM/yyyy");
Long number = fs.readLong(1);
String value = fs.readString("city");
String[] values = fs.getValues();
```

```java
    public class MyMapper implements FieldSetMapper<Payment>{
     @Override
     public Payment mapFieldSet(FieldSet fieldSet)
          throws BindException {
        ... = fieldSet.readString("source");
        ... = fieldSet.readBigDecimal("amount");
        ... = fieldSet.readDate("date");
     }
    }
```
</div> </ul>
</ol>

### Spring Integration
<ol >
    <li
        style="font-weight: bold;">
        <div  ><span
                >Main concepts (Messages, Channels, Endpoint types)</span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    ><span
                    >please, refer to </span><a
                    href="https://docs.google.com/document/d/1kAMz6QZD-iFhiJKCZcijb5c7mdp2VdmuX0ylA-yGZtc/edit#heading=h.41jqjf4k4rq6"
                    style="color: #009eb8; display: inline;  text-decoration: none; transition: color 0.3s;"><span
                    style="color: #1155cc; text-decoration: underline; ">this</span></a><span
                    >, and </span><a
                    href="https://docs.google.com/document/d/1g6xTuuZZaZ-r2kNxbwCYLIC6kjVeW_x3UvLnpfLQnac/edit#"
                    style="color: #009eb8; display: inline;  text-decoration: none; transition: color 0.3s;"><span
                    style="color: #1155cc; text-decoration: underline; ">this</span></a></span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >Pay special attention to the various Endpoint types and how they're used!</span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    >refer even more carefully the above</span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >How to programmatically create new Messages </span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    ><span
                    >MessageBuilder </span><span
                    >of course</span></span>
            </div>
        </li>
        <li
            >
            <div  ><span
                    >each message is created with unique ID</span>
            </div>
        </li>
        <li
            >
            <div  ><span
                    >Also </span><span
                    style="font-family: &quot;courier new&quot; , &quot;courier&quot; , monospace; ">MessagingTemplate </span><span
                    >is worth mentioning, which is a programmatic endpoint for sending the messages created by MessageBuilder (e.g. for testing)</span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >Using chains and bridges</span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    >see a.</span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >Synchronous vs. asynchronous message passing: the different Channel types and how each of them should be used</span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    >see a.</span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >The corresponding effects on things like transactions and security</span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    >see a.</span>
            </div>
        </li>
    </ul>
    <li
        style="font-weight: bold;">
        <div  ><span
                >The need for active polling and how to configure that </span>
        </div>
    </li>
    <ul >
        <li
            >
            <div  ><span
                    ><span
                    >see </span><a
                    href="https://docs.google.com/document/d/1kAMz6QZD-iFhiJKCZcijb5c7mdp2VdmuX0ylA-yGZtc/edit#heading=h.xl5a2aw6wmob"
                    style="color: #009eb8; display: inline;  text-decoration: none;"><span
                    style="color: #1155cc; text-decoration: underline; ">this</span></a><span
                    >, and </span><span
                    style="color: #1155cc; text-decoration: underline; "><a
                    href="https://docs.google.com/document/d/1kAMz6QZD-iFhiJKCZcijb5c7mdp2VdmuX0ylA-yGZtc/edit#heading=h.yik4lvhdqsdb"
                    style="color: #009eb8; display: inline;  text-decoration: none;">this</a></span></span>
            </div>
        </li>
    </ul>
</ol>
