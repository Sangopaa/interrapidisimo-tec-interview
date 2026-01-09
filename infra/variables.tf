variable "aws_region" {
  description = "AWS Region to deploy resources"
  default     = "us-east-1"
  type        = string
}

variable "project_name" {
  description = "Project name prefix"
  default     = "interview-web-app"
  type        = string
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  default     = "prod"
  type        = string
}
