import { BaseResource } from "./base";

export interface Resource {
  id: string;
  filename: string;
  description: string;
  type: string;
  category: string;
  format: string;
  userId: string;
  size?: number;
  downloads: number;
  createdAt: string;
  tags: string;
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
  storagePath?: string;
  resourceTypeId?: string;
  categoryId?: string;
}


export type ResourceCategory = BaseResource;
export type ResourceType = BaseResource;

export interface CreateResourceDTO {
  title: string;
  description: string;
  resource_type_id: string;
  category_id: string;
  file: File;
  format: string;
  size: string;
  tags: string[];
  fileUrl?: string;
  visibility?: string;
  permissions?: string;
}

export interface CreateResourceWithFileDTO {
  file: File;               
  title: string;
  description: string;
  resource_type_id: string;
  category_id: string;
  format: string;
  type: string;
  size: string;
  tags: string[];
  visibility?: string;
  permissions?: string;
  folder?: string;          
}