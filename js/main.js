// 主程序入口
document.addEventListener('DOMContentLoaded', function() {
    // 初始化画布
    const mathCanvas = new MathCanvas('mathCanvas');
    
    // 初始化控制器
    const controls = new Controls(mathCanvas);
    
    // 初始化知识点更新器
    const knowledgeUpdater = new KnowledgeUpdater(mathCanvas);
    
    // 初始化键盘控制
    const keyboardControls = new KeyboardControls(mathCanvas, controls);
    
    // 初始化触摸控制
    const touchControls = new TouchControls(mathCanvas);
    
    // 添加帮助提示
    addHelpTooltips();
    
    // 添加响应式处理
    handleResponsive();
    
    // 初始绘制
    mathCanvas.draw();
    
    console.log('正弦余弦曲线可视化工具已加载完成！');
    console.log('快捷键提示：');
    console.log('S - 切换正弦曲线显示');
    console.log('C - 切换余弦曲线显示');
    console.log('空格 - 开始/停止动画');
    console.log('R - 重置所有参数');
    console.log('方向键 - 调整参数（上下调振幅，左右调相位）');
});

// 添加帮助提示功能
function addHelpTooltips() {
    const tooltips = {
        'amplitude': '振幅控制曲线的最大偏离程度，值越大曲线越高',
        'frequency': '频率控制曲线的疏密程度，值越大曲线越密集',
        'phase': '相位控制曲线的左右平移，正值向左移，负值向右移',
        'offset': '垂直偏移控制曲线的上下平移'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
            
            // 添加悬停效果
            element.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            element.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }
    });
}

// 响应式处理
function handleResponsive() {
    function adjustCanvasSize() {
        const canvas = document.getElementById('mathCanvas');
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth - 20; // 减去padding
        
        if (window.innerWidth <= 768) {
            canvas.width = Math.min(containerWidth, 500);
            canvas.height = 300;
        } else if (window.innerWidth <= 1024) {
            canvas.width = Math.min(containerWidth, 600);
            canvas.height = 350;
        } else {
            canvas.width = 700;
            canvas.height = 400;
        }
        
        // 重新初始化画布参数
        const mathCanvas = window.mathCanvas;
        if (mathCanvas) {
            // 重新设置高DPI支持
            mathCanvas.setupHighDPI();
            mathCanvas.centerX = mathCanvas.width / 2;
            mathCanvas.centerY = mathCanvas.height / 2;
            // 根据画布大小调整缩放比例
            mathCanvas.scaleX = mathCanvas.width / 13;
            mathCanvas.scaleY = mathCanvas.height / 8;
            mathCanvas.draw();
        }
    }
    
    // 初始调整
    adjustCanvasSize();
    
    // 窗口大小改变时调整
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(adjustCanvasSize, 250);
    });
}

// 添加性能监控
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fps = 0;
        this.showFPS = false;
        
        // 添加FPS显示切换
        this.addFPSToggle();
    }
    
    addFPSToggle() {
        // 双击画布显示/隐藏FPS
        const canvas = document.getElementById('mathCanvas');
        let clickCount = 0;
        
        canvas.addEventListener('click', () => {
            clickCount++;
            setTimeout(() => {
                if (clickCount === 2) {
                    this.toggleFPS();
                }
                clickCount = 0;
            }, 300);
        });
    }
    
    toggleFPS() {
        this.showFPS = !this.showFPS;
        if (this.showFPS) {
            this.startMonitoring();
        }
    }
    
    startMonitoring() {
        const monitor = () => {
            if (!this.showFPS) return;
            
            const currentTime = performance.now();
            this.frameCount++;
            
            if (currentTime - this.lastTime >= 1000) {
                this.fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
                this.frameCount = 0;
                this.lastTime = currentTime;
                
                this.displayFPS();
            }
            
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }
    
    displayFPS() {
        const canvas = document.getElementById('mathCanvas');
        const ctx = canvas.getContext('2d');
        
        // 保存当前状态
        ctx.save();
        
        // 绘制FPS
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(canvas.width - 80, 10, 70, 25);
        
        ctx.fillStyle = '#fff';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`FPS: ${this.fps}`, canvas.width - 45, 28);
        
        // 恢复状态
        ctx.restore();
    }
}

// 添加数学公式渲染器
class FormulaRenderer {
    static renderFormula(amplitude, frequency, phase, offset, type = 'sin') {
        let formula = `y = `;
        
        // 振幅
        if (amplitude !== 1) {
            formula += `${amplitude.toFixed(1)} × `;
        }
        
        // 函数类型
        formula += `${type}(`;
        
        // 频率
        if (frequency !== 1) {
            formula += `${frequency.toFixed(1)}`;
        }
        formula += `x`;
        
        // 相位
        if (phase !== 0) {
            const phaseStr = phase > 0 ? ` + ${phase.toFixed(1)}` : ` - ${Math.abs(phase).toFixed(1)}`;
            formula += phaseStr;
        }
        
        formula += `)`;
        
        // 垂直偏移
        if (offset !== 0) {
            const offsetStr = offset > 0 ? ` + ${offset.toFixed(1)}` : ` - ${Math.abs(offset).toFixed(1)}`;
            formula += offsetStr;
        }
        
        return formula;
    }
}

// 添加导出功能
class ExportManager {
    static exportAsImage() {
        const canvas = document.getElementById('mathCanvas');
        const link = document.createElement('a');
        link.download = 'sine-cosine-graph.png';
        link.href = canvas.toDataURL();
        link.click();
    }
    
    static exportParameters() {
        const mathCanvas = window.mathCanvas;
        if (!mathCanvas) return;
        
        const params = {
            amplitude: mathCanvas.amplitude,
            frequency: mathCanvas.frequency,
            phase: mathCanvas.phase,
            offset: mathCanvas.offset,
            showSin: mathCanvas.showSin,
            showCos: mathCanvas.showCos,
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(params, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.download = 'sine-cosine-parameters.json';
        link.href = URL.createObjectURL(dataBlob);
        link.click();
    }
}

// 初始化性能监控
const performanceMonitor = new PerformanceMonitor();

// 全局变量，方便调试
window.mathCanvas = null;
window.controls = null;

// 在DOMContentLoaded事件中设置全局变量
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        window.mathCanvas = new MathCanvas('mathCanvas');
        window.controls = new Controls(window.mathCanvas);
    }, 100);
});

// 添加错误处理
window.addEventListener('error', function(e) {
    console.error('发生错误:', e.error);
    
    // 显示用户友好的错误信息
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff6b6b;
        color: white;
        padding: 15px;
        border-radius: 8px;
        z-index: 1000;
        max-width: 300px;
    `;
    errorDiv.textContent = '程序运行出现问题，请刷新页面重试';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
});

// 添加加载提示
function showLoadingIndicator() {
    const loading = document.createElement('div');
    loading.id = 'loading-indicator';
    loading.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(102, 126, 234, 0.9);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-size: 18px;
    `;
    loading.innerHTML = `
        <div style="text-align: center;">
            <div style="margin-bottom: 20px;">正在加载数学可视化工具...</div>
            <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto;"></div>
        </div>
    `;
    
    // 添加旋转动画
    const style = document.createElement('style');
    style.textContent = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loading);
}

function hideLoadingIndicator() {
    const loading = document.getElementById('loading-indicator');
    if (loading) {
        loading.remove();
    }
}

// 页面加载时显示加载提示
showLoadingIndicator();

// 页面完全加载后隐藏加载提示
window.addEventListener('load', function() {
    setTimeout(hideLoadingIndicator, 500);
});