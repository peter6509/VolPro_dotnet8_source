-----------------------------
-- Sequence structure for sf_project_template_id_seq
------------------------------
DROP SEQUENCE IF EXISTS "public"."sf_project_template_id_seq";
CREATE SEQUENCE "public"."sf_project_template_id_seq" 
INCREMENT 1
MINVALUE  1000
MAXVALUE 9223372036854775807
START 1000
CACHE 1;


------------------------------
-- Table structure for sf_project_template
------------------------------
DROP TABLE IF EXISTS "public"."sf_project_template";
CREATE TABLE "public"."sf_project_template" (
  "template_id" int4 NOT NULL DEFAULT nextval('sf_project_template_id_seq'::regclass),
  "name" varchar(200) COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "parentId" int4,
  "level_name" int4 ,
  "CreateID" int4,
  "Creator" varchar(30) COLLATE "pg_catalog"."default",
  "CreateDate" timestamp(6),
  "ModifyID" int4,
  "Modifier" varchar(30) COLLATE "pg_catalog"."default",
  "ModifyDate" timestamp(6)
)
;

SELECT setval('"public"."sf_project_template_id_seq"', 1001, true);
ALTER TABLE "public"."sf_project_template" ADD CONSTRAINT "sf_project_template_pkey" PRIMARY KEY ("template_id");

COMMENT ON COLUMN "public"."sf_project_template"."template_id" IS '主鍵';
COMMENT ON COLUMN "public"."sf_project_template"."name" IS '命名';
COMMENT ON COLUMN "public"."sf_project_template"."description" IS '描述';
COMMENT ON COLUMN "public"."sf_project_template"."parentId" IS '上階主鍵';
COMMENT ON COLUMN "public"."sf_project_template"."level_name" IS '級聯階層';
COMMENT ON COLUMN "public"."sf_project_template"."Creator" IS '創建人';
COMMENT ON COLUMN "public"."sf_project_template"."CreateDate" IS '創建時間';
COMMENT ON COLUMN "public"."sf_project_template"."Modifier" IS '修改人';
COMMENT ON COLUMN "public"."sf_project_template"."ModifyDate" IS '修改時間';
