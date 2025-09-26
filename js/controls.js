class Controls {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupEventListeners();
        this.updateDisplays();
    }
    
    setupEventListeners() {
        // 振幅控制
        const amplitudeSlider = document.getElementById('amplitude');
        amplitudeSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.canvas.amplitude = value;
            this.updateAmplitudeDisplay(value);
            this.canvas.draw();
        });
        
        // 频率控制
        const frequencySlider = document.getElementById('frequency');
        frequencySlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.canvas.frequency = value;
            this.updateFrequencyDisplay(value);
            this.canvas.draw();
        });
        
        // 相位控制
        const phaseSlider = document.getElementById('phase');
        phaseSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.canvas.phase = value;
            this.updatePhaseDisplay(value);
            this.canvas.draw();
        });
        
        // 垂直偏移控制
        const offsetSlider = document.getElementById('offset');
        offsetSlider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            this.canvas.offset = value;
            this.updateOffsetDisplay(value);
            this.canvas.draw();
        });
        
        // 图例区域的显示控制按钮
        const sinEyeBtn = document.getElementById('sin-eye');
        const cosEyeBtn = document.getElementById('cos-eye');
        
        const toggleSin = () => {
            this.canvas.toggleSin();
            if (this.canvas.showSin) {
                sinEyeBtn.classList.remove('hidden');
            } else {
                sinEyeBtn.classList.add('hidden');
            }
            // 同步函数公式的显示/隐藏
            const sinEquation = document.getElementById('sin-equation');
            sinEquation.style.display = this.canvas.showSin ? 'block' : 'none';
        };
        
        const toggleCos = () => {
            this.canvas.toggleCos();
            if (this.canvas.showCos) {
                cosEyeBtn.classList.remove('hidden');
            } else {
                cosEyeBtn.classList.add('hidden');
            }
            // 同步函数公式的显示/隐藏
            const cosEquation = document.getElementById('cos-equation');
            cosEquation.style.display = this.canvas.showCos ? 'block' : 'none';
        };
        
        sinEyeBtn.addEventListener('click', toggleSin);
        cosEyeBtn.addEventListener('click', toggleCos);
        
        // 动画控制
        const animateBtn = document.getElementById('animate');
        animateBtn.addEventListener('click', () => {
            if (this.canvas.animating) {
                this.canvas.stopAnimation();
                animateBtn.textContent = '开始动画';
                animateBtn.classList.remove('active');
            } else {
                this.canvas.startAnimation();
                animateBtn.textContent = '停止动画';
                animateBtn.classList.add('active');
            }
        });
        
        // 重置按钮
        const resetBtn = document.getElementById('reset');
        resetBtn.addEventListener('click', () => {
            this.resetAll();
        });

        // 预设函数按钮事件
        document.getElementById('preset-sin2x').addEventListener('click', () => {
            this.canvas.applyPreset('sin2x');
            this.updateControlsFromCanvas();
            this.updateActivePreset('preset-sin2x');
        });

        document.getElementById('preset-cos2x').addEventListener('click', () => {
            this.canvas.applyPreset('cos2x');
            this.updateControlsFromCanvas();
            this.updateActivePreset('preset-cos2x');
        });

        document.getElementById('preset-abs-sinx').addEventListener('click', () => {
            this.canvas.applyPreset('abs-sinx');
            this.updateControlsFromCanvas();
            this.updateActivePreset('preset-abs-sinx');
        });

        document.getElementById('preset-abs-sin2x').addEventListener('click', () => {
            this.canvas.applyPreset('abs-sin2x');
            this.updateControlsFromCanvas();
            this.updateActivePreset('preset-abs-sin2x');
        });
    }
    
    updateAmplitudeDisplay(value) {
        document.getElementById('amplitude-value').textContent = value.toFixed(1);
        document.getElementById('amplitude-display').textContent = value.toFixed(1);
        document.getElementById('amplitude-display-cos').textContent = value.toFixed(1);
    }
    
    updateFrequencyDisplay(value) {
        document.getElementById('frequency-value').textContent = value.toFixed(1);
        document.getElementById('frequency-display').textContent = value.toFixed(1);
        document.getElementById('frequency-display-cos').textContent = value.toFixed(1);
    }
    
    updatePhaseDisplay(value) {
        document.getElementById('phase-value').textContent = value.toFixed(1);
        document.getElementById('phase-display').textContent = value.toFixed(1);
        document.getElementById('phase-display-cos').textContent = value.toFixed(1);
    }
    
    updateOffsetDisplay(value) {
        document.getElementById('offset-value').textContent = value.toFixed(1);
        document.getElementById('offset-display').textContent = value.toFixed(1);
        document.getElementById('offset-display-cos').textContent = value.toFixed(1);
    }
    
    updateDisplays() {
        this.updateAmplitudeDisplay(this.canvas.amplitude);
        this.updateFrequencyDisplay(this.canvas.frequency);
        this.updatePhaseDisplay(this.canvas.phase);
        this.updateOffsetDisplay(this.canvas.offset);
    }
    
    // 从画布更新控件值
    updateControlsFromCanvas() {
        document.getElementById('amplitude').value = this.canvas.amplitude;
        document.getElementById('frequency').value = this.canvas.frequency;
        document.getElementById('phase').value = this.canvas.phase;
        document.getElementById('offset').value = this.canvas.offset;
        
        // 更新显示值
        this.updateDisplays();
        
        // 更新眼睛按钮状态
        const sinEyeBtn = document.getElementById('sin-eye');
        const cosEyeBtn = document.getElementById('cos-eye');
        
        if (this.canvas.showSin) {
            sinEyeBtn.classList.remove('hidden');
        } else {
            sinEyeBtn.classList.add('hidden');
        }
        
        if (this.canvas.showCos) {
            cosEyeBtn.classList.remove('hidden');
        } else {
            cosEyeBtn.classList.add('hidden');
        }
        
        // 更新函数公式显示状态
        document.getElementById('sin-equation').style.display = this.canvas.showSin ? 'block' : 'none';
        document.getElementById('cos-equation').style.display = this.canvas.showCos ? 'block' : 'none';
    }
    
    // 更新活跃的预设按钮
    updateActivePreset(activeId) {
        // 移除所有按钮的活跃状态
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // 添加活跃状态到当前按钮
        document.getElementById(activeId).classList.add('active');
    }

    resetAll() {
        // 重置滑块值
        document.getElementById('amplitude').value = 1;
        document.getElementById('frequency').value = 1;
        document.getElementById('phase').value = 0;
        document.getElementById('offset').value = 0;
        
        // 重置图例按钮状态
        document.getElementById('sin-eye').classList.remove('hidden');
        document.getElementById('cos-eye').classList.remove('hidden');
        
        // 重置函数公式显示状态
        document.getElementById('sin-equation').style.display = 'block';
        document.getElementById('cos-equation').style.display = 'block';
        
        const animateBtn = document.getElementById('animate');
        animateBtn.textContent = '开始动画';
        animateBtn.classList.remove('active');
        
        // 重置预设按钮状态
        const presetButtons = document.querySelectorAll('.preset-btn');
        presetButtons.forEach(btn => btn.classList.remove('active'));
        
        // 重置画布
        this.canvas.reset();
        this.updateDisplays();
    }
}

// 工具函数
class MathUtils {
    static formatAngle(radians) {
        const degrees = radians * 180 / Math.PI;
        return {
            degrees: degrees.toFixed(1),
            radians: radians.toFixed(2)
        };
    }
    
    static formatCoordinate(x, y) {
        return `(${x.toFixed(2)}, ${y.toFixed(2)})`;
    }
    
    static calculatePeriod(frequency) {
        return (2 * Math.PI / frequency).toFixed(2);
    }
    
    static calculateAmplitudeRange(amplitude, offset) {
        const min = (-amplitude + offset).toFixed(2);
        const max = (amplitude + offset).toFixed(2);
        return `[${min}, ${max}]`;
    }
}

// 知识点动态更新
class KnowledgeUpdater {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupDynamicUpdates();
    }
    
    setupDynamicUpdates() {
        // 监听参数变化，动态更新知识点显示
        const originalUpdateParameters = this.canvas.updateParameters.bind(this.canvas);
        this.canvas.updateParameters = (...args) => {
            originalUpdateParameters(...args);
            this.updateKnowledgeDisplay();
        };
    }
    
    updateKnowledgeDisplay() {
        // 更新周期显示
        const period = MathUtils.calculatePeriod(this.canvas.frequency);
        const periodElements = document.querySelectorAll('.period-value');
        periodElements.forEach(el => {
            if (el) el.textContent = `T = ${period}`;
        });
        
        // 更新值域显示
        const range = MathUtils.calculateAmplitudeRange(this.canvas.amplitude, this.canvas.offset);
        const rangeElements = document.querySelectorAll('.range-value');
        rangeElements.forEach(el => {
            if (el) el.textContent = `值域: ${range}`;
        });
    }
}

// 键盘快捷键支持
class KeyboardControls {
    constructor(canvas, controls) {
        this.canvas = canvas;
        this.controls = controls;
        this.setupKeyboardEvents();
    }
    
    setupKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 's':
                case 'S':
                    document.getElementById('show-sin').click();
                    break;
                case 'c':
                case 'C':
                    document.getElementById('show-cos').click();
                    break;
                case ' ':
                    e.preventDefault();
                    document.getElementById('animate').click();
                    break;
                case 'r':
                case 'R':
                    document.getElementById('reset').click();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this.adjustAmplitude(0.1);
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this.adjustAmplitude(-0.1);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.adjustPhase(-0.1);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.adjustPhase(0.1);
                    break;
            }
        });
    }
    
    adjustAmplitude(delta) {
        const slider = document.getElementById('amplitude');
        const newValue = Math.max(0.1, Math.min(3, parseFloat(slider.value) + delta));
        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
    }
    
    adjustPhase(delta) {
        const slider = document.getElementById('phase');
        const newValue = Math.max(-3.14, Math.min(3.14, parseFloat(slider.value) + delta));
        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
    }
}

// 触摸设备支持
class TouchControls {
    constructor(canvas) {
        this.canvas = canvas;
        this.setupTouchEvents();
    }
    
    setupTouchEvents() {
        let lastTouchX = 0;
        let lastTouchY = 0;
        
        this.canvas.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        });
        
        this.canvas.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const deltaX = touch.clientX - lastTouchX;
            const deltaY = touch.clientY - lastTouchY;
            
            // 水平滑动调整相位
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                const phaseSlider = document.getElementById('phase');
                const currentPhase = parseFloat(phaseSlider.value);
                const newPhase = Math.max(-3.14, Math.min(3.14, currentPhase + deltaX * 0.01));
                phaseSlider.value = newPhase;
                phaseSlider.dispatchEvent(new Event('input'));
            }
            // 垂直滑动调整振幅
            else {
                const amplitudeSlider = document.getElementById('amplitude');
                const currentAmplitude = parseFloat(amplitudeSlider.value);
                const newAmplitude = Math.max(0.1, Math.min(3, currentAmplitude - deltaY * 0.01));
                amplitudeSlider.value = newAmplitude;
                amplitudeSlider.dispatchEvent(new Event('input'));
            }
            
            lastTouchX = touch.clientX;
            lastTouchY = touch.clientY;
        });
    }
}