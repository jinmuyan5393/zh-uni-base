// const req = require.context("../../assets/icons/svg", false, /\.svg$/);
const modules = import.meta.glob(["../../assets/svg/*.svg"], { eager: true });

const icons = Object.keys(modules).map(key => {
  return modules[key].default;
});
export default icons;
