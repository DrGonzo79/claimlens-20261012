import type {NextConfig} from "next";
const repo=process.env.GITHUB_REPOSITORY?.split("/")[1]??"";
const pages=process.env.PAGES_BUILD==="true"&&repo.length>0;
const config:NextConfig={allowedDevOrigins:["127.0.0.1"],output:"export",trailingSlash:true,images:{unoptimized:true},basePath:pages?`/${repo}`:"",assetPrefix:pages?`/${repo}/`:""};
export default config;
