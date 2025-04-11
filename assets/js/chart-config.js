// Chart default configurations
Chart.defaults.font.family = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text');
Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border');

// Responsive chart plugin
Chart.register({
    id: 'responsiveAxis',
    beforeDraw: (chart, args, options) => {
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '12px ' + Chart.defaults.font.family;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = Chart.defaults.color;
    }
});

// Update chart colors when theme changes
document.documentElement.addEventListener('theme-change', () => {
    Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--text');
    Chart.defaults.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border');
    
    if (simulationState.charts.populationChart) {
        simulationState.charts.populationChart.update();
        simulationState.charts.traitsChart.update();
    }
});