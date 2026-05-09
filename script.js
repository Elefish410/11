// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航栏滚动效果
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // 向下滚动时隐藏导航栏
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // 向上滚动时显示导航栏
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// 滚动显示动画
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// 为需要动画的元素添加观察
document.addEventListener('DOMContentLoaded', () => {
    const scrollElements = document.querySelectorAll('.profile-card, .spec-item, .work-card, .contact-content');
    scrollElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
});

// 作品集过滤功能
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // 移除所有按钮的active类
        filterBtns.forEach(b => b.classList.remove('active'));
        // 添加当前按钮的active类
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        workCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                // 添加淡入动画
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// 鼠标悬停效果增强
document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// 标签悬停效果
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', () => {
        tag.style.transform = 'translateY(-2px) scale(1.05)';
    });
    
    tag.addEventListener('mouseleave', () => {
        tag.style.transform = 'translateY(0) scale(1)';
    });
});

// 页面加载完成后的初始化
window.addEventListener('load', () => {
    // 添加页面加载动画
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// 键盘导航支持
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // ESC键回到顶部
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});

// 性能优化：防抖函数
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 优化的滚动监听
const optimizedScroll = debounce(() => {
    // 可以在这里添加更多滚动相关的优化逻辑
}, 10);

window.addEventListener('scroll', optimizedScroll);

// 触摸设备优化
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // 为触摸设备调整交互效果
    document.querySelectorAll('.work-card, .spec-item').forEach(element => {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', () => {
            element.style.transform = 'scale(1)';
        });
    });
}

// 控制台欢迎信息
console.log('%c欢迎来到章悦的作品集网站！', 'color: #ffffff; font-size: 16px; font-weight: bold;');
console.log('%c浙江万里学院艺术与科技专业', 'color: #999; font-size: 12px;');

// ========== 图片拖拽上传功能 ==========
const dropZones = document.querySelectorAll('.drop-zone');

// 存储上传的图片数据（使用 localStorage）
let uploadedImages = JSON.parse(localStorage.getItem('portfolioImages')) || {};

// 初始化已保存的图片
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(uploadedImages).forEach(index => {
        const card = document.querySelector(`[data-index="${index}"]`);
        if (card && uploadedImages[index]) {
            displayImage(card, uploadedImages[index]);
        }
    });
});

dropZones.forEach(zone => {
    // 点击上传
    zone.addEventListener('click', (e) => {
        if (!zone.classList.contains('has-image') || e.target.classList.contains('upload-hint')) {
            const fileInput = zone.querySelector('.file-input');
            fileInput.click();
        }
    });

    // 文件选择
    const fileInput = zone.querySelector('.file-input');
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(zone, file);
        }
    });

    // 拖拽进入
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.add('drag-over');
    });

    // 拖拽离开
    zone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-over');
    });

    // 放下文件
    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.classList.remove('drag-over');

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleImageUpload(zone, file);
            } else {
                showNotification('请上传图片文件！', 'error');
            }
        }
    });
});

// 处理图片上传
function handleImageUpload(zone, file) {
    // 检查文件大小（限制为 10MB，因为会压缩）
    if (file.size > 10 * 1024 * 1024) {
        showNotification('图片太大啦！请选择小于 10MB 的图片', 'error');
        return;
    }

    showNotification('正在处理图片...', 'info');

    const reader = new FileReader();
    
    reader.onload = (e) => {
        const imageData = e.target.result;
        
        // 压缩图片
        compressImage(imageData, (compressedData) => {
            const index = zone.closest('.work-card').getAttribute('data-index');
            
            // 检查压缩后的大小
            const sizeInMB = (compressedData.length * 0.75) / (1024 * 1024);
            
            if (sizeInMB > 4.5) {
                showNotification('图片压缩后仍然过大，请选择更小的图片', 'error');
                return;
            }
            
            // 保存图片到 localStorage
            uploadedImages[index] = compressedData;
            try {
                localStorage.setItem('portfolioImages', JSON.stringify(uploadedImages));
            } catch (err) {
                console.warn('存储空间不足，尝试清理旧数据...');
                // 如果存储失败，尝试清理最旧的图片
                clearOldestImage();
                try {
                    localStorage.setItem('portfolioImages', JSON.stringify(uploadedImages));
                } catch (err2) {
                    console.error('存储空间完全不足');
                    showNotification('浏览器存储空间已满，请清除一些旧图片', 'error');
                    return;
                }
            }
            
            // 显示图片
            displayImage(zone, compressedData);
            
            const originalSize = (file.size / (1024 * 1024)).toFixed(2);
            const compressedSize = sizeInMB.toFixed(2);
            showNotification(`上传成功！${originalSize}MB → ${compressedSize}MB`, 'success');
        });
    };
    
    reader.onerror = () => {
        showNotification('图片读取失败！', 'error');
    };
    
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage(imageData, callback, maxWidth = 1200, maxHeight = 900, quality = 0.8) {
    const img = new Image();
    
    img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // 计算缩放比例
        if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = width * ratio;
            height = height * ratio;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为 JPEG 格式以减小文件大小
        const compressedData = canvas.toDataURL('image/jpeg', quality);
        callback(compressedData);
    };
    
    img.onerror = () => {
        showNotification('图片处理失败！', 'error');
    };
    
    img.src = imageData;
}

// 清理最旧的图片以释放空间
function clearOldestImage() {
    const keys = Object.keys(uploadedImages);
    if (keys.length > 0) {
        // 删除第一个（最旧的）图片
        delete uploadedImages[keys[0]];
        localStorage.setItem('portfolioImages', JSON.stringify(uploadedImages));
        
        // 更新显示
        const card = document.querySelector(`[data-index="${keys[0]}"]`);
        if (card) {
            const img = card.querySelector('img');
            const uploadHint = card.querySelector('.upload-hint');
            img.src = '';
            img.style.display = 'none';
            card.classList.remove('has-image');
            uploadHint.classList.remove('hidden');
        }
    }
}

// 显示图片
function displayImage(zone, imageData) {
    const img = zone.querySelector('img');
    const uploadHint = zone.querySelector('.upload-hint');
    
    img.src = imageData;
    img.style.display = 'block';
    zone.classList.add('has-image');
    uploadHint.classList.add('hidden');
}

// 显示通知消息
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // 样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '80px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        color: 'white',
        fontSize: '0.9rem',
        fontWeight: '500',
        zIndex: '10000',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        animation: 'slideInRight 0.3s ease',
        maxWidth: '300px'
    });

    // 根据类型设置颜色
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.background = colors[type] || colors.info;

    document.body.appendChild(notification);

    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加通知动画样式
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(notificationStyle);

// 清除所有图片功能
const clearAllBtn = document.getElementById('clearAllImages');
if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
        if (Object.keys(uploadedImages).length === 0) {
            showNotification('当前没有已上传的图片', 'info');
            return;
        }
        
        if (confirm('确定要清除所有已上传的图片吗？此操作不可恢复！')) {
            uploadedImages = {};
            localStorage.removeItem('portfolioImages');
            
            // 重置所有卡片显示
            document.querySelectorAll('.work-card').forEach(card => {
                const img = card.querySelector('img');
                const uploadHint = card.querySelector('.upload-hint');
                if (img && uploadHint) {
                    img.src = '';
                    img.style.display = 'none';
                    card.classList.remove('has-image');
                    uploadHint.classList.remove('hidden');
                }
            });
            
            showNotification('已清除所有图片', 'success');
        }
    });
}
