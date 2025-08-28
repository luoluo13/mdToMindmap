<template>
  <header class="header">
    <div class="logo">
      <div class="logo-icon">MD</div>
      <div class="logo-text">MD转XMind思维导图工具</div>
    </div>
    <div class="center-actions">
      <button class="btn btn-scroll" @click="scrollToBottom" title="跳转到页面底部">
        <span>⬇️</span>
        跳转底部
      </button>
    </div>
    <div class="header-actions">
      <button class="btn btn-secondary" @click="showSettings">
        <span>⚙️</span>
        设置
      </button>
      <button class="btn btn-secondary" @click="showHelp">
        <span>❓</span>
        帮助
      </button>
      <button class="btn btn-primary" @click="startUsing">
        <span>🚀</span>
        开始使用
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
const showSettings = () => {
  // 显示设置面板
  console.log('显示设置')
}

const showHelp = () => {
  // 显示帮助信息
  console.log('显示帮助')
}

const startUsing = () => {
  // 开始使用功能
  console.log('开始使用')
}

const scrollToBottom = () => {
  // 平滑滚动到页面底部
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px 30px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideDown 0.6s ease-out;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

.logo-text {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
}

.center-actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-secondary {
  background: #f8f9fa;
  color: #6c757d;
  border: 1px solid #e9ecef;
}

.btn-secondary:hover {
  background: #e9ecef;
  transform: translateY(-1px);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-scroll {
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border: 2px solid #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
  animation: bounce 2s infinite;
}

.btn-scroll:hover {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  animation: none;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-3px);
  }
  60% {
    transform: translateY(-2px);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>