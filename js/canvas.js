class MathCanvas {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // 高DPI支持
        this.dpr = window.devicePixelRatio || 1;
        this.setupHighDPI();
        
        // 画布参数
        this.width = this.canvas.width / this.dpr;
        this.height = this.canvas.height / this.dpr;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        this.scale = 50; // 每单位的像素数
        
        // 函数参数
        this.amplitude = 1;
        this.frequency = 1;
        this.phase = 0;
        this.offset = 0;
        
        // 显示控制
        this.showSin = true;
        this.showCos = true;
        
        // 函数类型控制
        this.useAbsoluteSin = false;
        this.useAbsoluteCos = false;
        
        // 动画控制
        this.animating = false;
        this.animationTime = 0;
        this.animationSpeed = 0.02;
        
        // 鼠标交互
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseOver = false;
        
        this.setupMouseEvents();
        this.draw();
    }
    
    setupHighDPI() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * this.dpr;
        this.canvas.height = rect.height * this.dpr;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        this.ctx.scale(this.dpr, this.dpr);
    }
    
    setupMouseEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left);
            this.mouseY = (e.clientY - rect.top);
            this.isMouseOver = true;
            this.updateMouseInfo();
            // 如果不在动画模式，则手动重绘
            if (!this.animating) {
                this.draw();
            }
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseOver = false;
            document.getElementById('mouse-coords').textContent = '坐标: (0, 0)';
            document.getElementById('angle-info').textContent = '角度: 0° (0 弧度)';
            // 如果不在动画模式，则手动重绘
            if (!this.animating) {
                this.draw();
            }
        });
    }
    
    updateMouseInfo() {
        // 将屏幕坐标转换为数学坐标
        const mathX = (this.mouseX - this.centerX) / this.scale;
        const mathY = -(this.mouseY - this.centerY) / this.scale;
        
        // 计算当前x位置的函数值
        let functionValues = '';
        if (this.showSin || this.showCos) {
            const adjustedX = this.frequency * mathX + this.phase;
            if (this.showSin) {
                let sinValue = this.amplitude * Math.sin(adjustedX) + this.offset;
                if (this.useAbsoluteSin) {
                    sinValue = Math.abs(this.amplitude * Math.sin(adjustedX)) + this.offset;
                    functionValues += ` |sin(x)|=${sinValue.toFixed(3)}`;
                } else {
                    functionValues += ` sin(x)=${sinValue.toFixed(3)}`;
                }
            }
            if (this.showCos) {
                let cosValue = this.amplitude * Math.cos(adjustedX) + this.offset;
                if (this.useAbsoluteCos) {
                    cosValue = Math.abs(this.amplitude * Math.cos(adjustedX)) + this.offset;
                    functionValues += ` |cos(x)|=${cosValue.toFixed(3)}`;
                } else {
                    functionValues += ` cos(x)=${cosValue.toFixed(3)}`;
                }
            }
        }
        
        // 更新显示
        document.getElementById('mouse-coords').textContent =
            `坐标: (${mathX.toFixed(2)}, ${mathY.toFixed(2)})${functionValues}`;
        
        // 角度信息
        const radians = mathX;
        const degrees = radians * 180 / Math.PI;
        document.getElementById('angle-info').textContent =
            `角度: ${degrees.toFixed(1)}° (${radians.toFixed(2)} 弧度)`;
    }
    
    clear() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        // 设置高质量渲染
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
    }
    
    draw() {
        this.clear();
        this.drawGrid();
        this.drawAxes();
        this.drawAxisLabels();
        
        // 绘制单位圆
        this.drawUnitCircle();
        
        if (this.showSin) {
            this.drawSineCurve();
        }
        if (this.showCos) {
            this.drawCosineCurve();
        }
        
        // 绘制峰值点
        this.drawPeakPoints();
        // 移除Canvas中的图例绘制，使用HTML图例
        // this.drawLegend();
        
        // 绘制鼠标悬停点和参考线
        if (this.isMouseOver) {
            this.drawMouseHover();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 0.5;
        
        // 垂直网格线
        for (let x = this.centerX % this.scale; x < this.width; x += this.scale) {
            const alignedX = Math.round(x) + 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(alignedX, 0);
            this.ctx.lineTo(alignedX, this.height);
            this.ctx.stroke();
        }
        
        // 水平网格线
        for (let y = this.centerY % this.scale; y < this.height; y += this.scale) {
            const alignedY = Math.round(y) + 0.5;
            this.ctx.beginPath();
            this.ctx.moveTo(0, alignedY);
            this.ctx.lineTo(this.width, alignedY);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 2;
        this.ctx.lineCap = 'round';
        
        // X轴
        const xAxisY = Math.round(this.centerY) + 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, xAxisY);
        this.ctx.lineTo(this.width, xAxisY);
        this.ctx.stroke();
        
        // Y轴
        const yAxisX = Math.round(this.centerX) + 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(yAxisX, 0);
        this.ctx.lineTo(yAxisX, this.height);
        this.ctx.stroke();
    }
    
    drawAxisLabels() {
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // X轴标签 (π的倍数)
        const piScale = this.scale / Math.PI;
        for (let i = -10; i <= 10; i++) {
            if (i === 0) continue;
            const x = this.centerX + i * Math.PI * piScale;
            if (x >= 0 && x <= this.width) {
                this.ctx.fillText(
                    i === 1 ? 'π' : i === -1 ? '-π' : `${i}π`,
                    x,
                    this.centerY + 20
                );
            }
        }
        
        // Y轴标签
        for (let i = -5; i <= 5; i++) {
            if (i === 0) continue;
            const y = this.centerY - i * this.scale;
            if (y >= 20 && y <= this.height - 20) {
                this.ctx.fillText(i.toString(), this.centerX - 20, y);
            }
        }
        
        // 原点
        this.ctx.fillText('0', this.centerX - 15, this.centerY + 15);
    }
    
    drawSineCurve() {
        if (!this.showSin) return;
        
        this.ctx.strokeStyle = '#e53e3e';
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        let firstPoint = true;
        
        // 高精度采样
        for (let x = 0; x <= this.width; x += 0.5) {
            const mathX = (x - this.centerX) / this.scale;
            const adjustedX = this.frequency * mathX + this.phase;
            let sinValue = this.amplitude * Math.sin(adjustedX) + this.offset;
            
            // 如果使用绝对值函数
            if (this.useAbsoluteSin) {
                sinValue = Math.abs(this.amplitude * Math.sin(adjustedX)) + this.offset;
            }
            
            const y = this.centerY - sinValue * this.scale;
            
            if (firstPoint) {
                this.ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }
    
    drawCosineCurve() {
        if (!this.showCos) return;
        
        this.ctx.strokeStyle = '#136CE9';
        this.ctx.lineWidth = 2.5;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        this.ctx.beginPath();
        let firstPoint = true;
        
        // 高精度采样
        for (let x = 0; x <= this.width; x += 0.5) {
            const mathX = (x - this.centerX) / this.scale;
            const adjustedX = this.frequency * mathX + this.phase;
            let cosValue = this.amplitude * Math.cos(adjustedX) + this.offset;
            
            // 如果使用绝对值函数
            if (this.useAbsoluteCos) {
                cosValue = Math.abs(this.amplitude * Math.cos(adjustedX)) + this.offset;
            }
            
            const y = this.centerY - cosValue * this.scale;
            
            if (firstPoint) {
                this.ctx.moveTo(x, y);
                firstPoint = false;
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }
    
    drawPeakPoints() {
        // 绘制峰值点（最高点和最低点）
        const visibleRange = this.width / this.scale; // 可见范围
        const startX = -this.centerX / this.scale;
        const endX = startX + visibleRange;
        
        // 计算周期
        const period = 2 * Math.PI / this.frequency;
        
        // 找到可见范围内的峰值点
        const startPeriod = Math.floor((startX - this.phase / this.frequency) / period);
        const endPeriod = Math.ceil((endX - this.phase / this.frequency) / period);
        
        for (let n = startPeriod; n <= endPeriod; n++) {
            if (this.showSin) {
                // 正弦函数的峰值点
                // 最高点: sin(x) = 1, 即 frequency * x + phase = π/2 + 2nπ
                const sinMaxX = (Math.PI/2 + 2*n*Math.PI - this.phase) / this.frequency;
                // 最低点: sin(x) = -1, 即 frequency * x + phase = 3π/2 + 2nπ
                const sinMinX = (3*Math.PI/2 + 2*n*Math.PI - this.phase) / this.frequency;
                
                // 绘制正弦最高点
                const sinMaxScreenX = this.centerX + sinMaxX * this.scale;
                if (sinMaxScreenX >= 0 && sinMaxScreenX <= this.width) {
                    const sinMaxY = this.centerY - (this.amplitude + this.offset) * this.scale;
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.beginPath();
                    this.ctx.arc(sinMaxScreenX, sinMaxY, 4, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#e53e3e';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
                
                // 绘制正弦最低点（仅在非绝对值模式下）
                if (!this.useAbsoluteSin) {
                    const sinMinScreenX = this.centerX + sinMinX * this.scale;
                    if (sinMinScreenX >= 0 && sinMinScreenX <= this.width) {
                        const sinMinY = this.centerY - (-this.amplitude + this.offset) * this.scale;
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.beginPath();
                        this.ctx.arc(sinMinScreenX, sinMinY, 4, 0, 2 * Math.PI);
                        this.ctx.fill();
                        this.ctx.strokeStyle = '#e53e3e';
                        this.ctx.lineWidth = 2;
                        this.ctx.stroke();
                    }
                }
            }
            
            if (this.showCos) {
                // 余弦函数的峰值点
                // 最高点: cos(x) = 1, 即 frequency * x + phase = 2nπ
                const cosMaxX = (2*n*Math.PI - this.phase) / this.frequency;
                // 最低点: cos(x) = -1, 即 frequency * x + phase = π + 2nπ
                const cosMinX = (Math.PI + 2*n*Math.PI - this.phase) / this.frequency;
                
                // 绘制余弦最高点
                const cosMaxScreenX = this.centerX + cosMaxX * this.scale;
                if (cosMaxScreenX >= 0 && cosMaxScreenX <= this.width) {
                    const cosMaxY = this.centerY - (this.amplitude + this.offset) * this.scale;
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.beginPath();
                    this.ctx.arc(cosMaxScreenX, cosMaxY, 4, 0, 2 * Math.PI);
                    this.ctx.fill();
                    this.ctx.strokeStyle = '#136CE9';
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                }
                
                // 绘制余弦最低点（仅在非绝对值模式下）
                if (!this.useAbsoluteCos) {
                    const cosMinScreenX = this.centerX + cosMinX * this.scale;
                    if (cosMinScreenX >= 0 && cosMinScreenX <= this.width) {
                        const cosMinY = this.centerY - (-this.amplitude + this.offset) * this.scale;
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.beginPath();
                        this.ctx.arc(cosMinScreenX, cosMinY, 4, 0, 2 * Math.PI);
                        this.ctx.fill();
                        this.ctx.strokeStyle = '#136CE9';
                        this.ctx.lineWidth = 2;
                        this.ctx.stroke();
                    }
                }
            }
        }
    }
    
    drawLegend() {
        // 绘制图例
        const legendY = 25;
        let legendX = 20;
        
        this.ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        this.ctx.textBaseline = 'middle';
        
        if (this.showSin) {
            // 正弦图例
            this.ctx.strokeStyle = '#e53e3e';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(legendX, legendY);
            this.ctx.lineTo(legendX + 30, legendY);
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('sin(x)', legendX + 40, legendY);
            legendX += 100;
        }
        
        if (this.showCos) {
            // 余弦图例
            this.ctx.strokeStyle = '#136CE9';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(legendX, legendY);
            this.ctx.lineTo(legendX + 30, legendY);
            this.ctx.stroke();
            
            this.ctx.fillStyle = '#136CE9';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('cos(x)', legendX + 40, legendY);
        }
    }
    
    drawMouseHover() {
        if (!this.isMouseOver) return;
        
        // 计算数学坐标
        const mathX = (this.mouseX - this.centerX) / this.scale;
        const adjustedX = this.frequency * mathX + this.phase;
        
        // 绘制垂直参考线
        this.ctx.strokeStyle = 'rgba(128, 128, 128, 0.5)';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.mouseX, 0);
        this.ctx.lineTo(this.mouseX, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // 绘制函数值点和水平参考线
        if (this.showSin) {
            let sinValue = this.amplitude * Math.sin(adjustedX) + this.offset;
            if (this.useAbsoluteSin) {
                sinValue = Math.abs(this.amplitude * Math.sin(adjustedX)) + this.offset;
            }
            const sinY = this.centerY - sinValue * this.scale;
            
            // 水平参考线
            this.ctx.strokeStyle = 'rgba(229, 62, 62, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(0, sinY);
            this.ctx.lineTo(this.mouseX, sinY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // 正弦点 - 实心
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, sinY, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
        
        if (this.showCos) {
            let cosValue = this.amplitude * Math.cos(adjustedX) + this.offset;
            if (this.useAbsoluteCos) {
                cosValue = Math.abs(this.amplitude * Math.cos(adjustedX)) + this.offset;
            }
            const cosY = this.centerY - cosValue * this.scale;
            
            // 水平参考线
            this.ctx.strokeStyle = 'rgba(19, 108, 233, 0.3)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(0, cosY);
            this.ctx.lineTo(this.mouseX, cosY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // 余弦点 - 实心
            this.ctx.fillStyle = '#136CE9';
            this.ctx.beginPath();
            this.ctx.arc(this.mouseX, cosY, 5, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    
    updateParameters(amplitude, frequency, phase, offset) {
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.phase = phase;
        this.offset = offset;
        if (!this.animating) {
            this.draw();
        }
    }
    
    toggleSin() {
        this.showSin = !this.showSin;
        if (!this.animating) {
            this.draw();
        }
    }
    
    toggleCos() {
        this.showCos = !this.showCos;
        if (!this.animating) {
            this.draw();
        }
    }
    
    startAnimation() {
        this.animating = true;
        this.animate();
    }
    
    stopAnimation() {
        this.animating = false;
    }
    
    animate() {
        if (!this.animating) return;
        
        this.animationTime += this.animationSpeed;
        this.phase = this.animationTime;
        this.draw();
        
        requestAnimationFrame(() => this.animate());
    }
    
    // 预设函数方法
    applyPreset(presetType) {
        switch(presetType) {
            case 'sin2x':
                this.amplitude = 1;
                this.frequency = 2;
                this.phase = 0;
                this.offset = 0;
                this.showSin = true;
                this.showCos = false;
                this.useAbsoluteSin = false;
                this.useAbsoluteCos = false;
                break;
            case 'cos2x':
                this.amplitude = 1;
                this.frequency = 2;
                this.phase = 0;
                this.offset = 0;
                this.showSin = false;
                this.showCos = true;
                this.useAbsoluteSin = false;
                this.useAbsoluteCos = false;
                break;
            case 'abs-sinx':
                this.amplitude = 1;
                this.frequency = 1;
                this.phase = 0;
                this.offset = 0;
                this.showSin = true;
                this.showCos = false;
                this.useAbsoluteSin = true;
                this.useAbsoluteCos = false;
                break;
            case 'abs-sin2x':
                this.amplitude = 1;
                this.frequency = 2;
                this.phase = 0;
                this.offset = 0;
                this.showSin = true;
                this.showCos = false;
                this.useAbsoluteSin = true;
                this.useAbsoluteCos = false;
                break;
        }
        this.draw();
    }

    resize(width, height) {
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        this.setupHighDPI();
        
        this.width = this.canvas.width / this.dpr;
        this.height = this.canvas.height / this.dpr;
        this.centerX = this.width / 2;
        this.centerY = this.height / 2;
        
        this.draw();
    }

    drawUnitCircle() {
        // 单位圆的位置和大小
        const circleX = this.width - 120; // 右上角位置
        const circleY = 80;
        const radius = 50;
        
        // 绘制单位圆背景
        this.ctx.fillStyle = 'rgba(248, 250, 252, 0.9)';
        this.ctx.beginPath();
        this.ctx.arc(circleX, circleY, radius + 15, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 绘制单位圆
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(circleX, circleY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // 绘制坐标轴
        this.ctx.strokeStyle = '#cbd5e0';
        this.ctx.lineWidth = 1;
        // 水平轴
        this.ctx.beginPath();
        this.ctx.moveTo(circleX - radius - 5, circleY);
        this.ctx.lineTo(circleX + radius + 5, circleY);
        this.ctx.stroke();
        // 垂直轴
        this.ctx.beginPath();
        this.ctx.moveTo(circleX, circleY - radius - 5);
        this.ctx.lineTo(circleX, circleY + radius + 5);
        this.ctx.stroke();
        
        // 计算当前角度（基于鼠标位置或动画时间）
        let angle = 0;
        if (this.isMouseOver) {
            const mathX = (this.mouseX - this.centerX) / this.scale;
            angle = this.frequency * mathX + this.phase;
        } else if (this.animating) {
            angle = this.animationTime;
        }
        
        // 绘制角度线
        const pointX = circleX + radius * Math.cos(angle);
        const pointY = circleY - radius * Math.sin(angle);
        
        this.ctx.strokeStyle = '#4a5568';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(circleX, circleY);
        this.ctx.lineTo(pointX, pointY);
        this.ctx.stroke();
        
        // 绘制sin和cos的投影线
        if (this.showSin) {
            // sin值的垂直投影
            this.ctx.strokeStyle = '#e53e3e';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(pointX, pointY);
            this.ctx.lineTo(pointX, circleY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // sin值标注
            this.ctx.fillStyle = '#e53e3e';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'left';
            this.ctx.fillText('sin', pointX + 5, (pointY + circleY) / 2);
        }
        
        if (this.showCos) {
            // cos值的水平投影
            this.ctx.strokeStyle = '#136CE9';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([3, 3]);
            this.ctx.beginPath();
            this.ctx.moveTo(pointX, pointY);
            this.ctx.lineTo(circleX, pointY);
            this.ctx.stroke();
            this.ctx.setLineDash([]);
            
            // cos值标注
            this.ctx.fillStyle = '#136CE9';
            this.ctx.font = '10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('cos', (pointX + circleX) / 2, pointY - 5);
        }
        
        // 绘制角度点
        this.ctx.fillStyle = '#4a5568';
        this.ctx.beginPath();
        this.ctx.arc(pointX, pointY, 4, 0, 2 * Math.PI);
        this.ctx.fill();
        
        // 绘制角度标注
        this.ctx.fillStyle = '#4a5568';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('θ', circleX + 15, circleY - 15);
    }
}