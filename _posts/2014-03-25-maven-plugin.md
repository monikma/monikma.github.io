---
layout: post
title: Maven plugin - smallest example
date: '2014-03-25T12:30:00.001+01:00'
author: Monik
tags:
- Programming
- Maven
modified_time: '2016-01-13T21:00:06.051+01:00'
blogger_id: tag:blogger.com,1999:blog-5940427300271272994.post-973232027202579435
blogger_orig_url: http://learningmonik.blogspot.com/2014/03/maven-plugin.html
commentIssueId: 22
---

<div class="bg-info panel-body" markdown="1">
My notes about how to start developing Maven plugins, based on <a href="https://maven.apache.org/guides/plugin/guide-java-plugin-development.html">https://maven.apache.org/guides/plugin/guide-java-plugin-development.html</a>.
</div>

<h3>Table of contents</h3>
- TOC
{:toc max_level=2}


### Maven Plugins

<ul>
    <li><span>the    properties to configure are defined in plugin goals</span>
    </li>
    <li>
        <span>the    versions of dependencies in the plugin override the dependency    versions of the project</span>
    </li>
    <li><span>configuration    can be placed:</span></li>
    <ul>
        <li><span>under    the plugin node - it is the global plugin configuration</span>
        </li>
        <li>
            <span>under    the executions/execution node - it is the configuration for this    particular execution</span>
        </li>
    </ul>
</ul>
<span style="font-family: 'Times New Roman'; ">Below  are the minimal sample steps of developing a Maven plugin:</span><br/>

##### 1. Define the plugin

<pre style="padding-left: 20px;"><span style="">package </span><span
        style="background-color: yellow;">sample.plugin</span><span style="">;<br/><br/>import org.apache.maven.plugin.AbstractMojo;<br/>import org.apache.maven.plugin.MojoExecutionException;<br/>import org.apache.maven.plugins.annotations.Mojo;<br/><br/>/**<br/> * Says "Hi" to the user.<br/> *<br/> */<br/></span><span
        style=""><b>@Mojo</b></span><span style="">( name = "</span><span
        style="background-color: lime;">sayhi</span><span
        style="">")<br/>public class <b>GreetingMojo </b>extends <b>AbstractMojo</b><br/>{<br/>    public void execute() throws MojoExecutionException<br/>    {<br/>        getLog().info( "Hello, world." );<br/>    }<br/>}</span></pre>

<pre style="padding-left: 20px;"><span style="">&lt;project&gt;<br/>  &lt;modelVersion&gt;4.0.0&lt;/modelVersion&gt;<br/><br/>  &lt;groupId&gt;</span><span
        style="background-color: yellow;">sample.plugin</span><span style="">&lt;/groupId&gt;<br/>  &lt;artifactId&gt;</span><span
        style="background-color: cyan;">hello-maven-plugin</span><span style="">&lt;/artifactId&gt;<br/>  &lt;version&gt;</span><span
        style="background-color: cyan;">1.0-SNAPSHOT</span><span
        style="">&lt;/version&gt;<br/>  &lt;packaging&gt;maven-plugin&lt;/packaging&gt;<br/><br/>  &lt;name&gt;Sample Parameter-less Maven Plugin&lt;/name&gt;<br/><br/>  &lt;dependencies&gt;<br/>    &lt;dependency&gt;<br/>      &lt;groupId&gt;<b>org.apache.maven</b>&lt;/groupId&gt;<br/>      &lt;artifactId&gt;<b>maven-plugin-api</b>&lt;/artifactId&gt;<br/>      &lt;version&gt;2.0&lt;/version&gt;<br/>    &lt;/dependency&gt;<br/>  &lt;/dependencies&gt;<br/>&lt;/project&gt;</span></pre>

##### 2. Add the plugin to another project

<pre style="padding-left: 20px; "><span style="">&lt;build&gt;<br/>    &lt;plugins&gt;<br/>      &lt;plugin&gt;<br/>        &lt;groupId&gt;</span><span
        style="background-color: cyan;">sample.plugin</span><span
        style="">&lt;/groupId&gt;<br/>        &lt;artifactId&gt;</span><span
        style="background-color: cyan;">hello-maven-plugin</span><span style="">&lt;/artifactId&gt;<br/>        &lt;version&gt;</span><span
        style="background-color: cyan;">1.0-SNAPSHOT</span><span
        style="">&lt;/version&gt;<br/>      &lt;/plugin&gt;<br/>    &lt;/plugins&gt;<br/>&lt;/build&gt;</span><br/></pre>

##### 3. Run the plugin

<pre style="padding-left: 20px;">mvn <span style="background-color: cyan;">sample.plugin</span>:<span
        style="background-color: cyan;">hello-maven-plugin</span>:<span
        style="background-color: cyan;">1.0-SNAPSHOT</span>:<span style="background-color: lime;">sayhi</span></pre>
<pre style="padding-left: 20px;">mvn <span style="background-color: cyan;">hello</span>:<span
        style="background-color: lime;">sayhi</span></pre>

##### 4. Attach the plugin to a build lifecycle phase

<pre style="padding-left: 20px;"><span style="">&lt;build&gt;<br/>    &lt;plugins&gt;<br/>      &lt;plugin&gt;<br/>        &lt;groupId&gt;</span><span
        style="background-color: cyan;">sample.plugin</span><span
        style="">&lt;/groupId&gt;<br/>        &lt;artifactId&gt;</span><span
        style="background-color: cyan;">hello-maven-plugin</span><span style="">&lt;/artifactId&gt;<br/>        &lt;version&gt;</span><span
        style="background-color: cyan;">1.0-SNAPSHOT</span><span
        style="">&lt;/version&gt;<br/>        </span><b><span
        style="">&lt;executions&gt;<br/>          &lt;execution&gt;<br/>            &lt;phase&gt;compile&lt;/phase&gt;<br/>            &lt;goals&gt;<br/>              &lt;goal&gt;</span><span
        style="background-color: lime;">sayhi</span><span style="">&lt;/goal&gt;<br/>            &lt;/goals&gt;<br/>          &lt;/execution&gt;<br/>        &lt;/executions&gt;</span></b><span
        style=""><br/>      &lt;/plugin&gt;<br/>    &lt;/plugins&gt;<br/>  &lt;/build&gt;</span></pre>

### Maven Archetypes

<div>
    <span>"Maven   archetype" is a short name for "maven archetype plugin"!</span><br/><span><br/></span><span> </span>
</div>
<span>For  example the&nbsp;</span><span
        style="font-family: Courier New, Courier, monospace;">maven-archetype-quickstart</span><span>&nbsp;plugin  we run like this:</span><br/><span
        style="font-family: Courier New, Courier, monospace;"><br/></span><span
        style="font-family: Courier New, Courier, monospace;">&gt;mvn  archetype:generate</span><br/><span
        style="font-family: Courier New, Courier, monospace;">-DgroupId=com.companyname.bank</span><br/><span
        style="font-family: Courier New, Courier, monospace;">-DartifactId=consumerBanking</span><br/><span
        style="font-family: Courier New, Courier, monospace;">-DarchetypeArtifactId=maven-archetype-quickstart</span><br/><span
        style="font-family: Courier New, Courier, monospace;">-DinteractiveMode=false</span></div>
