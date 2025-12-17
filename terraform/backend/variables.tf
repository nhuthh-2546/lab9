variable "region" {
  type = string
  default = "ap-southeast-1"
}

variable "project" {
  type = string
  default = "nhut-learning-tf"
}

variable "principal_arns" {
  default     = null
  type        = list(string)
}