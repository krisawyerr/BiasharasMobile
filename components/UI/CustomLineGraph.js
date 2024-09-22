import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Line, Circle, Text as SvgText } from 'react-native-svg';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { formatDollarAmountShorthand } from '../../utils/format';

export default function CustomLineGraph({ graphData, selectedIndex, setSelectedIndex, numberColor, lineColor, selectorColor }) {
    const [graphWidth, setGraphWidth] = useState(0);
    const height = 200;
    const paddingVertical = 15;
    const horizontalPadding = 23;
    const maxValue = Math.max(...graphData);
    const minValue = Math.min(...graphData);
    const scaleY = (height - 2 * paddingVertical) / (maxValue - minValue);

    const handleGestureEvent = (event) => {
        const { x } = event.nativeEvent;
        const relativeX = x - horizontalPadding; 
        const index = Math.round((relativeX / (graphWidth - 2 * horizontalPadding)) * (graphData.length - 1));
        if (index >= 0 && index < graphData.length) {
            setSelectedIndex(index);
        }
    };

    const handleGestureEnd = () => {
        setSelectedIndex(null);
    };

    return (
        <PanGestureHandler onGestureEvent={handleGestureEvent} onEnded={handleGestureEnd}>
            <View
                style={styles.graphContainer}
                onLayout={(event) => {
                    const { width } = event.nativeEvent.layout;
                    setGraphWidth(width);
                }}
            >
                <Svg width={graphWidth} height={height}>
                    {graphData.map((value, index) => {
                        const x1 = (index * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding;
                        const y1 = height - paddingVertical - (value - minValue) * scaleY;

                        const x2 = index === graphData.length - 1 
                            ? graphWidth - horizontalPadding 
                            : ((index + 1) * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding;
                        const y2 = index === graphData.length - 1 ? y1 : height - paddingVertical - (graphData[index + 1] - minValue) * scaleY;

                        return <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={lineColor} strokeWidth="2" />;
                    })}

                    {selectedIndex !== null && (
                        <>
                            <Line
                                x1={(selectedIndex * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                y1={paddingVertical}
                                x2={(selectedIndex * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                y2={height - paddingVertical}
                                stroke={selectorColor}
                                strokeWidth="2"
                                strokeDasharray="5, 5"
                            />
                            <Circle
                                cx={(selectedIndex * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                                cy={height - paddingVertical - (graphData[selectedIndex] - minValue) * scaleY}
                                r={5}
                                fill={selectorColor}
                            />
                        </>
                    )}

                    <SvgText
                        x={(graphData.indexOf(maxValue) * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                        y={height - paddingVertical - (maxValue - minValue) * scaleY - 3}
                        fill={numberColor}
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {formatDollarAmountShorthand(maxValue)}
                    </SvgText>
                    <SvgText
                        x={(graphData.indexOf(minValue) * (graphWidth - 2 * horizontalPadding)) / (graphData.length - 1) + horizontalPadding}
                        y={height - paddingVertical - (minValue - minValue) * scaleY + 13}
                        fill={numberColor}
                        fontSize="12"
                        textAnchor="middle"
                    >
                        {formatDollarAmountShorthand(minValue)}
                    </SvgText>
                </Svg>
            </View>
        </PanGestureHandler>
    );
}

const styles = StyleSheet.create({
    graphContainer: {
        height: 200,
        width: '100%',
    },
});
