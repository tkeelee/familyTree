package com.familytree.util;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

/**
 * 文件操作工具类，用于处理文本文件的读写
 */
public class FileUtil {
    private static final String DATA_DIR = "data";
    
    /**
     * 确保数据目录存在
     */
    public static void ensureDataDirExists() {
        File dataDir = new File(DATA_DIR);
        if (!dataDir.exists()) {
            dataDir.mkdirs();
        }
    }
    
    /**
     * 将内容写入文件
     * @param fileName 文件名
     * @param content 要写入的内容
     * @param append 是否追加模式
     * @return 是否写入成功
     */
    public static boolean writeToFile(String fileName, String content, boolean append) {
        ensureDataDirExists();
        Path filePath = Paths.get(DATA_DIR, fileName);
        try (BufferedWriter writer = new BufferedWriter(
                new OutputStreamWriter(new FileOutputStream(filePath.toFile(), append), StandardCharsets.UTF_8))) {
            writer.write(content);
            writer.newLine();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 从文件读取所有行
     * @param fileName 文件名
     * @return 文件内容行列表
     */
    public static List<String> readAllLines(String fileName) {
        ensureDataDirExists();
        Path filePath = Paths.get(DATA_DIR, fileName);
        File file = filePath.toFile();
        
        if (!file.exists()) {
            return new ArrayList<>();
        }
        
        try {
            return Files.readAllLines(filePath, StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    
    /**
     * 删除文件中的一行
     * @param fileName 文件名
     * @param lineToRemove 要删除的行
     * @return 是否删除成功
     */
    public static boolean removeLine(String fileName, String lineToRemove) {
        ensureDataDirExists();
        Path filePath = Paths.get(DATA_DIR, fileName);
        File file = filePath.toFile();
        
        if (!file.exists()) {
            return false;
        }
        
        try {
            List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
            List<String> newLines = new ArrayList<>();
            
            for (String line : lines) {
                if (!line.equals(lineToRemove)) {
                    newLines.add(line);
                }
            }
            
            Files.write(filePath, newLines, StandardCharsets.UTF_8);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
    
    /**
     * 更新文件中的一行
     * @param fileName 文件名
     * @param oldLine 旧行内容
     * @param newLine 新行内容
     * @return 是否更新成功
     */
    public static boolean updateLine(String fileName, String oldLine, String newLine) {
        ensureDataDirExists();
        Path filePath = Paths.get(DATA_DIR, fileName);
        File file = filePath.toFile();
        
        if (!file.exists()) {
            return false;
        }
        
        try {
            List<String> lines = Files.readAllLines(filePath, StandardCharsets.UTF_8);
            List<String> newLines = new ArrayList<>();
            
            for (String line : lines) {
                if (line.equals(oldLine)) {
                    newLines.add(newLine);
                } else {
                    newLines.add(line);
                }
            }
            
            Files.write(filePath, newLines, StandardCharsets.UTF_8);
            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }
}