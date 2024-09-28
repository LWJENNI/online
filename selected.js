
    const box = document.getElementById('box');
    const tooltip = document.createElement('div');

    // Настройки tooltip
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = '#333';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '5px 10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.whiteSpace = 'nowrap';
    tooltip.style.display = 'none'; // Скрываем по умолчанию

    // Добавляем стрелку
    const arrow = document.createElement('div');
    arrow.style.position = 'absolute';
    arrow.style.width = '0';
    arrow.style.height = '0';
    arrow.style.borderLeft = '5px solid transparent';
    arrow.style.borderRight = '5px solid transparent';
    arrow.style.borderTop = '5px solid #333'; // Цвет стрелки
    arrow.style.top = '100%'; // Под tooltip
    arrow.style.left = '50%';
    arrow.style.transform = 'translateX(-50%)';

    tooltip.appendChild(arrow);
    document.body.appendChild(tooltip);

    box.addEventListener('mouseenter', (event) => {
        tooltip.textContent = 'Наведение!';
        tooltip.style.display = 'block';
        const boxRect = box.getBoundingClientRect();
        tooltip.style.left = `${boxRect.left + window.scrollX + boxRect.width / 2 - tooltip.offsetWidth / 2}px`;
        tooltip.style.top = `${boxRect.top + window.scrollY - tooltip.offsetHeight - 10}px`; // 10px отступ сверху
    });

    box.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
    });
