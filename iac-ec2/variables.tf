variable "mysql_endpoint" {
  description = "endpoint"
  type        = string
}

variable "mysql_username" {
  description = "Username"
  type        = string
}

variable "mysql_password" {
  description = "MySQL password"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database Name"
  type        = string
  default     = "telemedicine"
}

variable "app_user" {
  description = "User "
  type        = string
  default     = "tele_user"
}

variable "app_password" {
  description = "Password"
  type        = string
  sensitive   = true
}
