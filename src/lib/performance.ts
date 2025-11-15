export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map()

  static startMeasure(label: string): () => void {
    const start = performance.now()
    
    return () => {
      const duration = performance.now() - start
      this.recordMetric(label, duration)
      
      if (duration > 1000) {
        console.warn(`Slow operation: ${label} took ${duration.toFixed(2)}ms`)
      }
    }
  }

  private static recordMetric(label: string, duration: number) {
    if (!this.metrics.has(label)) {
      this.metrics.set(label, [])
    }
    
    const metrics = this.metrics.get(label)!
    metrics.push(duration)
    
    if (metrics.length > 100) {
      metrics.shift()
    }
  }

  static getAverageTime(label: string): number {
    const metrics = this.metrics.get(label)
    if (!metrics || metrics.length === 0) return 0
    
    const sum = metrics.reduce((a, b) => a + b, 0)
    return sum / metrics.length
  }

  static getMetrics() {
    const result: Record<string, { avg: number; count: number }> = {}
    
    this.metrics.forEach((values, label) => {
      const sum = values.reduce((a, b) => a + b, 0)
      result[label] = {
        avg: sum / values.length,
        count: values.length,
      }
    })
    
    return result
  }
}

export function useMeasure(label: string) {
  return () => PerformanceMonitor.startMeasure(label)
}
