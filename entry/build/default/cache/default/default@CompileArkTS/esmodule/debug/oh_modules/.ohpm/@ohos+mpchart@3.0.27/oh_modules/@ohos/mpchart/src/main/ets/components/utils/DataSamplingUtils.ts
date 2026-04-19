import { JArrayList } from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/utils/JArrayList";
import EntryOhos from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/EntryOhos";
import BarEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BarEntry";
import BubbleEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/BubbleEntry";
import CandleEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/CandleEntry";
import PieEntry from "@package:pkg_modules/.ohpm/@ohos+mpchart@3.0.27/pkg_modules/@ohos/mpchart/src/main/ets/components/data/PieEntry";
/**
 * 数据采样工具类
 * 提供最小-最大采样算法，用于优化大数据渲染性能
 */
export class DataSamplingUtils {
    // 默认采样阈值
    public static readonly DEFAULT_SAMPLE_THRESHOLD: number = 5000;
    // 默认目标数量
    public static readonly DEFAULT_TARGET_SIZE: number = 5000;
    /**
     * 最小-最大采样算法
     * 将数据分成多个窗口，每个窗口保留最小值和最大值
     * 保留原始X轴坐标值，确保图表比例和范围正确
     *
     * @param originalData 原始数据
     * @param targetSize 目标数据量
     * @returns 采样后的数据
     */
    public static minMaxSampling(originalData: JArrayList<EntryOhos>, targetSize: number): JArrayList<EntryOhos> {
        if (originalData.size() <= targetSize) {
            return originalData;
        }
        const step = Math.floor(originalData.size() / targetSize);
        const sampledData = new JArrayList<EntryOhos>();
        for (let i = 0; i < originalData.size(); i += step) {
            const windowEnd = Math.min(i + step, originalData.size());
            if (i === windowEnd - 1) {
                // 窗口只有1个点，直接添加（保留原始X值）
                const entry = originalData.get(i);
                sampledData.add(new EntryOhos(entry.getX(), entry.getY(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
            }
            else {
                // 窗口有多个点，找最小值和最大值
                let minIdx = i;
                let maxIdx = i;
                for (let j = i + 1; j < windowEnd; j++) {
                    const currentY = originalData.get(j).getY();
                    const minY = originalData.get(minIdx).getY();
                    const maxY = originalData.get(maxIdx).getY();
                    if (currentY < minY)
                        minIdx = j;
                    if (currentY > maxY)
                        maxIdx = j;
                }
                // 添加最小值和最大值（避免重复，保留原始X值）
                if (minIdx !== maxIdx) {
                    const minEntry = originalData.get(minIdx);
                    const maxEntry = originalData.get(maxIdx);
                    sampledData.add(new EntryOhos(minEntry.getX(), minEntry.getY(), minEntry.getIcon() ?? undefined, minEntry.getData() ?? undefined));
                    sampledData.add(new EntryOhos(maxEntry.getX(), maxEntry.getY(), maxEntry.getIcon() ?? undefined, maxEntry.getData() ?? undefined));
                }
                else {
                    const entry = originalData.get(minIdx);
                    sampledData.add(new EntryOhos(entry.getX(), entry.getY(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
                }
            }
        }
        return sampledData;
    }
    /**
     * 最小-最大采样算法（针对BarEntry）
     * 将数据分成多个窗口，每个窗口保留最小值和最大值
     * 保留原始X轴坐标值，确保图表比例和范围正确
     *
     * @param originalData 原始数据
     * @param targetSize 目标数据量
     * @returns 采样后的数据
     */
    public static minMaxSamplingBarEntry(originalData: JArrayList<BarEntry>, targetSize: number): JArrayList<BarEntry> {
        if (originalData.size() <= targetSize) {
            return originalData;
        }
        const step = Math.floor(originalData.size() / targetSize);
        const sampledData = new JArrayList<BarEntry>();
        for (let i = 0; i < originalData.size(); i += step) {
            const windowEnd = Math.min(i + step, originalData.size());
            if (i === windowEnd - 1) {
                // 窗口只有1个点，直接添加（保留原始X值）
                const entry = originalData.get(i);
                sampledData.add(new BarEntry(entry.getX(), entry.getY(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
            }
            else {
                // 窗口有多个点，找最小值和最大值
                let minIdx = i;
                let maxIdx = i;
                for (let j = i + 1; j < windowEnd; j++) {
                    const currentY = originalData.get(j).getY();
                    const minY = originalData.get(minIdx).getY();
                    const maxY = originalData.get(maxIdx).getY();
                    if (currentY < minY)
                        minIdx = j;
                    if (currentY > maxY)
                        maxIdx = j;
                }
                // 添加最小值和最大值（避免重复，保留原始X值）
                if (minIdx !== maxIdx) {
                    const minEntry = originalData.get(minIdx);
                    const maxEntry = originalData.get(maxIdx);
                    sampledData.add(new BarEntry(minEntry.getX(), minEntry.getY(), minEntry.getIcon() ?? undefined, minEntry.getData() ?? undefined));
                    sampledData.add(new BarEntry(maxEntry.getX(), maxEntry.getY(), maxEntry.getIcon() ?? undefined, maxEntry.getData() ?? undefined));
                }
                else {
                    const entry = originalData.get(minIdx);
                    sampledData.add(new BarEntry(entry.getX(), entry.getY(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
                }
            }
        }
        return sampledData;
    }
    /**
     * 最小-最大采样算法（针对BubbleEntry）
     * 将数据分成多个窗口，每个窗口保留最小值和最大值
     * 保留原始X轴坐标值，确保图表比例和范围正确
     *
     * @param originalData 原始数据
     * @param targetSize 目标数据量
     * @returns 采样后的数据
     */
    public static minMaxSamplingBubbleEntry(originalData: JArrayList<BubbleEntry>, targetSize: number): JArrayList<BubbleEntry> {
        if (originalData.size() <= targetSize) {
            return originalData;
        }
        const step = Math.floor(originalData.size() / targetSize);
        const sampledData = new JArrayList<BubbleEntry>();
        for (let i = 0; i < originalData.size(); i += step) {
            const windowEnd = Math.min(i + step, originalData.size());
            if (i === windowEnd - 1) {
                // 窗口只有1个点，直接添加（保留原始X值）
                const entry = originalData.get(i);
                sampledData.add(new BubbleEntry(entry.getX(), entry.getY(), entry.getSize(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
            }
            else {
                // 窗口有多个点，找最小值和最大值（基于Y值）
                let minIdx = i;
                let maxIdx = i;
                for (let j = i + 1; j < windowEnd; j++) {
                    const currentY = originalData.get(j).getY();
                    const minY = originalData.get(minIdx).getY();
                    const maxY = originalData.get(maxIdx).getY();
                    if (currentY < minY)
                        minIdx = j;
                    if (currentY > maxY)
                        maxIdx = j;
                }
                // 添加最小值和最大值（避免重复，保留原始X值）
                if (minIdx !== maxIdx) {
                    const minEntry = originalData.get(minIdx);
                    const maxEntry = originalData.get(maxIdx);
                    sampledData.add(new BubbleEntry(minEntry.getX(), minEntry.getY(), minEntry.getSize(), minEntry.getIcon() ?? undefined, minEntry.getData() ?? undefined));
                    sampledData.add(new BubbleEntry(maxEntry.getX(), maxEntry.getY(), maxEntry.getSize(), maxEntry.getIcon() ?? undefined, maxEntry.getData() ?? undefined));
                }
                else {
                    const entry = originalData.get(minIdx);
                    sampledData.add(new BubbleEntry(entry.getX(), entry.getY(), entry.getSize(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
                }
            }
        }
        return sampledData;
    }
    /**
     * 最小-最大采样算法（针对CandleEntry）
     * 将数据分成多个窗口，每个窗口保留最小值和最大值
     * 保留原始X轴坐标值，确保图表比例和范围正确
     *
     * @param originalData 原始数据
     * @param targetSize 目标数据量
     * @returns 采样后的数据
     */
    public static minMaxSamplingCandleEntry(originalData: JArrayList<CandleEntry>, targetSize: number): JArrayList<CandleEntry> {
        if (originalData.size() <= targetSize) {
            return originalData;
        }
        const step = Math.floor(originalData.size() / targetSize);
        const sampledData = new JArrayList<CandleEntry>();
        for (let i = 0; i < originalData.size(); i += step) {
            const windowEnd = Math.min(i + step, originalData.size());
            if (i === windowEnd - 1) {
                // 窗口只有1个点，直接添加（保留原始X值）
                const entry = originalData.get(i);
                sampledData.add(new CandleEntry(entry.getX(), entry.getHigh(), entry.getLow(), entry.getOpen(), entry.getClose(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
            }
            else {
                // 窗口有多个点，找最小值和最大值（基于High值）
                let minIdx = i;
                let maxIdx = i;
                for (let j = i + 1; j < windowEnd; j++) {
                    const currentHigh = originalData.get(j).getHigh();
                    const minHigh = originalData.get(minIdx).getHigh();
                    const maxHigh = originalData.get(maxIdx).getHigh();
                    if (currentHigh < minHigh)
                        minIdx = j;
                    if (currentHigh > maxHigh)
                        maxIdx = j;
                }
                // 添加最小值和最大值（避免重复，保留原始X值）
                if (minIdx !== maxIdx) {
                    const minEntry = originalData.get(minIdx);
                    const maxEntry = originalData.get(maxIdx);
                    sampledData.add(new CandleEntry(minEntry.getX(), minEntry.getHigh(), minEntry.getLow(), minEntry.getOpen(), minEntry.getClose(), minEntry.getIcon() ?? undefined, minEntry.getData() ?? undefined));
                    sampledData.add(new CandleEntry(maxEntry.getX(), maxEntry.getHigh(), maxEntry.getLow(), maxEntry.getOpen(), maxEntry.getClose(), maxEntry.getIcon() ?? undefined, maxEntry.getData() ?? undefined));
                }
                else {
                    const entry = originalData.get(minIdx);
                    sampledData.add(new CandleEntry(entry.getX(), entry.getHigh(), entry.getLow(), entry.getOpen(), entry.getClose(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
                }
            }
        }
        return sampledData;
    }
    /**
     * 最小-最大采样算法（针对PieEntry）
     * 将数据分成多个窗口，每个窗口保留最小值和最大值
     * 保留 PieEntry 的 label 属性
     *
     * @param originalData 原始数据
     * @param targetSize 目标数据量
     * @returns 采样后的数据
     */
    public static minMaxSamplingPieEntry(originalData: JArrayList<PieEntry>, targetSize: number): JArrayList<PieEntry> {
        if (originalData.size() <= targetSize) {
            return originalData;
        }
        const step = Math.floor(originalData.size() / targetSize);
        const sampledData = new JArrayList<PieEntry>();
        for (let i = 0; i < originalData.size(); i += step) {
            const windowEnd = Math.min(i + step, originalData.size());
            if (i === windowEnd - 1) {
                // 窗口只有1个点，直接添加（保留原始属性）
                const entry = originalData.get(i);
                sampledData.add(new PieEntry(entry.getY(), entry.getLabel(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
            }
            else {
                // 窗口有多个点，找最小值和最大值
                let minIdx = i;
                let maxIdx = i;
                for (let j = i + 1; j < windowEnd; j++) {
                    const currentY = originalData.get(j).getY();
                    const minY = originalData.get(minIdx).getY();
                    const maxY = originalData.get(maxIdx).getY();
                    if (currentY < minY)
                        minIdx = j;
                    if (currentY > maxY)
                        maxIdx = j;
                }
                // 添加最小值和最大值（避免重复，保留原始属性）
                if (minIdx !== maxIdx) {
                    const minEntry = originalData.get(minIdx);
                    const maxEntry = originalData.get(maxIdx);
                    sampledData.add(new PieEntry(minEntry.getY(), minEntry.getLabel(), minEntry.getIcon() ?? undefined, minEntry.getData() ?? undefined));
                    sampledData.add(new PieEntry(maxEntry.getY(), maxEntry.getLabel(), maxEntry.getIcon() ?? undefined, maxEntry.getData() ?? undefined));
                }
                else {
                    const entry = originalData.get(minIdx);
                    sampledData.add(new PieEntry(entry.getY(), entry.getLabel(), entry.getIcon() ?? undefined, entry.getData() ?? undefined));
                }
            }
        }
        return sampledData;
    }
    /**
     * 判断是否需要采样
     *
     * @param dataCount 数据量
     * @param threshold 采样阈值
     * @returns 是否需要采样
     */
    public static shouldSample(dataCount: number, threshold: number): boolean {
        return dataCount > threshold;
    }
}
