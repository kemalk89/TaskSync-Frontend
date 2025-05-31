// we have to tell typescript how to handle imports of *.module.css files.
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}
