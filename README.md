# Caro Game - Full Stack Application

Dự án game Caro với backend Rails API và frontend Next.js, được deploy lên AWS ECS sử dụng Terraform và CI/CD với GitHub Actions.

## 📁 Cấu trúc dự án

```
lab9/
├── caro-game-be/          # Backend Rails API
│   ├── app/               # Application code
│   ├── config/            # Rails configuration
│   ├── db/                # Database migrations
│   └── docker/            # Dockerfile và entrypoint
├── caro-game-fe/          # Frontend Next.js
│   ├── src/               # Source code
│   └── public/            # Static files
├── terraform/             # Infrastructure as Code
│   ├── backend/           # S3 backend configuration
│   └── main/              # Main infrastructure
│       └── modules/       # Terraform modules
│           ├── alb/       # Application Load Balancer
│           ├── database/  # RDS PostgreSQL
│           ├── ecr/       # Elastic Container Registry
│           ├── ecs/       # ECS Cluster & Service
│           ├── iam/       # IAM Roles & GitHub Actions OIDC
│           └── networking/# VPC, Subnets, Security Groups
├── .github/workflows/     # CI/CD pipelines
└── docs/                  # Documentation
```

## 🏗️ Architecture

- [Architecture](images/image.png)

## 🚀 Prerequisites

- **Terraform** >= 1.0
- **AWS CLI** đã cấu hình với credentials
- **Docker** (để build images locally)
- **Git**

## 📦 Setup Terraform

### Bước 1: Tạo S3 Backend (chỉ cần làm 1 lần)

```bash
cd terraform/backend

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply để tạo S3 bucket và DynamoDB table cho backend
terraform apply
```

Sau khi apply xong, copy output `config` để cập nhật vào `terraform/main/main.tf`.

### Bước 2: Cập nhật Backend Configuration

Mở file `terraform/main/main.tf` và cập nhật block `backend "s3"` với thông tin từ output:

```hcl
terraform {
  backend "s3" {
    bucket         = "<bucket-name-from-output>"
    key            = "learning"
    region         = "ap-southeast-1"
    encrypt        = true
    dynamodb_table = "<dynamodb-table-from-output>"
  }
}
```

### Bước 3: Cập nhật Variables

Mở file `terraform/main/variables.tf` và cập nhật:

```hcl
variable "github_org" {
  default = "your-github-username"  # GitHub username hoặc organization
}

variable "github_repo" {
  default = "lab9"  # Tên repository
}
```

### Bước 4: Deploy Infrastructure

```bash
cd terraform/main

# Initialize Terraform
terraform init

# Review changes
terraform plan

# Apply infrastructure
terraform apply
```

### Bước 5: Lấy Outputs

```bash
# Xem tất cả outputs
terraform output

# Lấy GitHub Actions Role ARN
terraform output github_actions_role_arn

# Lấy ECR Repository URL
terraform output ecr_repository_url

# Lấy Backend URL
terraform output backend_url
```

## 🔧 Cấu hình GitHub Actions

### Thêm Repository Secret

1. Vào GitHub Repository → Settings → Secrets and variables → Actions
2. Thêm secret mới:
   - **Name:** `AWS_ROLE_ARN`
   - **Value:** Output từ `terraform output github_actions_role_arn`

### Workflow tự động

Workflow sẽ tự động chạy khi:
- Push code vào branch `main` với changes trong `caro-game-be/`
- Manual trigger từ Actions tab

## 🏷️ Resource Naming Convention

| Resource | Name Pattern |
|----------|--------------|
| ECR Repository | `{project}-api-ecr-repository` |
| ECS Cluster | `{project}-main-ecs-cluster` |
| ECS Service | `{project}-backend-ecs-service` |
| Task Definition | `{project}-backend-task-definition` |
| ALB | `{project}-api-alb` |
| RDS | `{project}-db` |

Với `project = "nhut-learning-tf"`, các resources sẽ có tên:
- ECR: `nhut-learning-tf-api-ecr-repository`
- ECS Cluster: `nhut-learning-tf-main-ecs-cluster`
- ECS Service: `nhut-learning-tf-backend-ecs-service`

## 🧹 Cleanup

Để xóa toàn bộ infrastructure:

```bash
# Xóa main infrastructure
cd terraform/main
terraform destroy

# Xóa backend (S3 bucket cần empty trước)
cd terraform/backend
terraform destroy
```

## 🛠️ Tech Stack

- **Backend:** Ruby on Rails 8, GraphQL
- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Database:** PostgreSQL (RDS)
- **Container:** Docker, ECS Fargate
- **Infrastructure:** Terraform, AWS
- **CI/CD:** GitHub Actions
