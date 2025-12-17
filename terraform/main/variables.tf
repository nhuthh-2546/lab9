variable "region" {
  type    = string
  default = "ap-southeast-1"
}

variable "project" {
  type    = string
  default = "nhut-learning-tf"
}

variable "github_org" {
  description = "GitHub organization or username"
  type        = string
  default     = "nhuthh-2546"
}

variable "github_repo" {
  description = "GitHub repository name"
  type        = string
  default     = "lab9"
}
