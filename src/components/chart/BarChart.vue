<template>
  <div>
    <canvas id="ratingChart"></canvas>
  </div>
</template>

<script setup>
import { watch, onMounted, computed } from 'vue';
import Chart from 'chart.js/auto';

let chart = null;

const props = defineProps(['ratingCounts']);

const totalReviews = computed(() => {
  return Object.values(props.ratingCounts).reduce((sum, count) => sum + count, 0);
});

const ratingPercentages = computed(() => {
  return {
    5: totalReviews.value ? Math.round((props.ratingCounts[5] / totalReviews.value) * 100) : 0,
    4: totalReviews.value ? Math.round((props.ratingCounts[4] / totalReviews.value) * 100) : 0,
    3: totalReviews.value ? Math.round((props.ratingCounts[3] / totalReviews.value) * 100) : 0,
    2: totalReviews.value ? Math.round((props.ratingCounts[2] / totalReviews.value) * 100) : 0,
    1: totalReviews.value ? Math.round((props.ratingCounts[1] / totalReviews.value) * 100) : 0,
  };
});

const renderChart = () => {
  const ctx = document.getElementById('ratingChart').getContext('2d');

  if (chart) {
    chart.destroy();
  }

  const isReview = totalReviews.value > 0;

  const percentages = [
    props.ratingCounts[5] / totalReviews.value || 0,
    props.ratingCounts[4] / totalReviews.value || 0,
    props.ratingCounts[3] / totalReviews.value || 0,
    props.ratingCounts[2] / totalReviews.value || 0,
    props.ratingCounts[1] / totalReviews.value || 0,
  ];

  const remaining = percentages.map((p) => 1 - p);

  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['5점', '4점', '3점', '2점', '1점'],
      datasets: [
        {
          label: '평점 비율',
          data: percentages.map((p) => p * totalReviews.value),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          hoverBackgroundColor: null,
          stack: 'Stack 1',
          barPercentage: 0.3,
          borderRadius: percentages.map((p, index) => ({
            topLeft: remaining[index] > 0 ? 0 : 10,
            topRight: remaining[index] > 0 ? 0 : 10,
            bottomLeft: p > 0 ? 10 : 10,
            bottomRight: p > 0 ? 10 : 10,
          })),
        },
        {
          label: '남은 공간',
          data: isReview ? remaining.map((r) => r * totalReviews.value) : [1, 1, 1, 1, 1],
          backgroundColor: 'rgb(247, 247, 247)',
          hoverBackgroundColor: null,
          stack: 'Stack 1',
          barPercentage: 0.3,
          borderRadius: remaining.map((r, index) => ({
            topLeft: percentages[index] > 0 ? 10 : 10,
            topRight: percentages[index] > 0 ? 10 : 10,
            bottomLeft: r === 1 ? 10 : 0,
            bottomRight: r === 1 ? 10 : 0,
          })),
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      interaction: {
        mode: null,
      },
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
          ticks: {
            font: {
              size: 14,
              weight: 'bold',
            },
            color: 'black',
          },
        },
        y: {
          stacked: true,
          grid: {
            display: false,
          },
          ticks: {
            display: false,
          },
          beginAtZero: true,
          suggestedMax: isReview ? totalReviews.value * 1.1 : 1.1,
          border: {
            display: false,
          },
        },
      },
      elements: {
        bar: {
          barThickness: 5,
          borderSkipped: false,
        },
      },
    },
    plugins: [
      {
        id: 'customLabels',
        afterDraw(chart) {
          const ctx = chart.ctx;
          ctx.save();
          ctx.font = 'bold 14px Arial';
          ctx.fillStyle = 'black';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';

          chart.scales.x.ticks.forEach((tick, index) => {
            const meta = chart.getDatasetMeta(0);
            const data = meta.data[index];

            if (data) {
              const x = data.x;
              const y = 20;

              const percentage = ratingPercentages.value[5 - index] || 0;
              const label = `${percentage}%`;

              ctx.fillText(label, x, y);
            }
          });

          ctx.restore();
        },
      },
    ],
  });
};

watch(() => props.ratingCounts, renderChart, { deep: true });
onMounted(renderChart);
</script>

<style scoped></style>
