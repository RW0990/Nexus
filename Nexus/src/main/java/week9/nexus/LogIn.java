/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package week9.nexus;
import java.util.Scanner;
/**
 *
 * @author ryanwhite
 */
public class LogIn {
    private String username;
    private String password;
    
    public LogIn(){
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setPassword(String password) {
        this.password = password;
    }
    
    public void  newLogin(){
        Scanner input=new Scanner(System.in);
        System.out.println("Please enter your username:");
        username=input.next();
        System.out.println("Please enter your password:");
        password=input.next();
    }
     public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
    @Override
    public String toString(){
        return "Welcome back "+username;
    }
}


