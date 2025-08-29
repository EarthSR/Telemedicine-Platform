terraform {
  required_version = ">= 1.6.0"
  required_providers {
    mysql = {
      source  = "petoju/mysql"
      version = "~> 3.0"
    }
  }
}

# Provider: ชี้ไปที่ MySQL server ที่มีอยู่ (container)
provider "mysql" {
  endpoint = var.mysql_endpoint
  username = var.mysql_username
  password = var.mysql_password
}

# สร้าง Database ใหม่
resource "mysql_database" "app" {
  name = var.db_name
}

# สร้าง User ใหม่
resource "mysql_user" "app_user" {
  user     = var.app_user
  host     = "%"
  plaintext_password = var.app_password
}

# ให้สิทธิ์ User
resource "mysql_grant" "app_user_privileges" {
  user       = mysql_user.app_user.user
  host       = mysql_user.app_user.host
  database   = mysql_database.app.name
  privileges = ["ALL PRIVILEGES"]
}
