package com.familytree;

import com.familytree.controller.FamilyController;
import com.familytree.controller.FamilyTreeController;
import com.familytree.controller.PersonController;
import com.familytree.controller.UserController;
import com.familytree.util.FileUtil;
import com.google.gson.Gson;
import spark.Spark;

/**
 * 家谱应用程序入口类
 */
public class Application {
    private static final int PORT = 8080;
    private static final Gson gson = new Gson();
    
    public static void main(String[] args) {
        // 确保数据目录存在
        FileUtil.ensureDataDirExists();
        
        // 配置Spark
        Spark.port(PORT);
        Spark.staticFileLocation("/public");
        
        // 设置响应类型
        Spark.before((request, response) -> {
            response.type("application/json");
        });
        
        // 注册控制器
        new UserController(gson).registerRoutes();
        new FamilyTreeController(gson).registerRoutes();
        new FamilyController(gson).registerRoutes();
        new PersonController(gson).registerRoutes();
        
        // 启动完成
        Spark.awaitInitialization();
        System.out.println("家谱应用已启动，访问 http://localhost:" + PORT);
    }
}