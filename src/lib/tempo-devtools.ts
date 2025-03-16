// This is a placeholder for the tempo-devtools module
// You can remove this file and its imports if you don't need this functionality

// Create a mock TempoDevtools object with an init method
const TempoDevtools = {
  init: () => {
    console.log("Mock TempoDevtools initialized");
  }
};

// Make it globally available
(window as any).TempoDevtools = TempoDevtools;

export default TempoDevtools; 