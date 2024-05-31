import { ref, onMounted, onBeforeUnmount, watchEffect, ShallowRef } from "vue";

interface DarkModeDetector {
  isDark: ShallowRef<Boolean>;
}

const useDark = (): DarkModeDetector => {
  const isDark = ref(false);

  const checkDarkMode = () => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    isDark.value = isDarkMode;
  };

  // Initial check on component mount
  onMounted(() => {
    checkDarkMode();
  });

  // Watch for changes (e.g., if the user toggles dark mode)
  watchEffect(() => {
    checkDarkMode();
  });

  // Clean up when the component is unmounted
  onBeforeUnmount(() => {
    // You can perform any cleanup here if needed
  });

  // Return the reactive isDark value
  return {
    isDark
  };
};

export default useDark;
