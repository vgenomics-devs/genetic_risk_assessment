import React from 'react';
import { Button, Tooltip } from 'antd';

interface ResultData {
    riskLevel?: string;
    summary?: string;
}

interface ResultPanelProps {
    resultData: ResultData | null;
    navigate: (path: string) => void;
}



const ResultPanel: React.FC<ResultPanelProps> = ({ resultData, navigate }) => {
    const getRiskColor = (level?: string) => {
        switch (level?.toLowerCase()) {
            case 'low risk':
                return '#4CAF50'; // green
            case 'moderate risk':
                return '#FF9800'; // orange
            case 'high risk':
                return '#F44336'; // red
            case 'severe risk':
                return '#B71C1C'; // dark red
            default:
                return '#999';
        }
    };

    const riskSegments = [
        { label: 'Low Risk', color: '#4CAF50' },
        { label: 'Moderate Risk', color: '#FF9800' },
        { label: 'High Risk', color: '#F44336' },
        { label: 'Severe Risk', color: '#B71C1C' },
    ];



    interface Styles {
        resultBT: React.CSSProperties;
        scaleContainer: React.CSSProperties;
        segmentWrapper: React.CSSProperties;
        arrow: React.CSSProperties;
        segment: (color: string, isFirst: boolean, isLast: boolean) => React.CSSProperties;
    }



    const styles: Styles = {

        resultBT: {
            backgroundColor: 'black',
            color: 'white',
            padding: '20px 26px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            marginBottom: '40px',
            fontSize: '14px',
            fontWeight: 600,
        },
        scaleContainer: {
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginTop: 10,
            marginBottom: 10,
            width: '100%',
            gap: 4,
        },
        segmentWrapper: {
            flex: 1,
            textAlign: 'center',
        },
        arrow: {
            fontSize: 16,
            marginBottom: 4,
            color: '#000',
        },
        segment: (color: string, isFirst: boolean, isLast: boolean): React.CSSProperties => ({
            backgroundColor: color,
            height: 18,
            width: '100%',
            borderTopLeftRadius: isFirst ? 6 : 0,
            borderBottomLeftRadius: isFirst ? 6 : 0,
            borderTopRightRadius: isLast ? 6 : 0,
            borderBottomRightRadius: isLast ? 6 : 0,
        }),
    };

    if (!resultData) return null;

    const currentRiskLabel = resultData.riskLevel?.toLowerCase().replace(/\s+/g, '');

    return (
        <div
            style={{
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F5F5F5',
                padding: 16,
                overflowY: 'auto',
            }}
        >
            <h2 style={{ textAlign: 'center' }}>Result</h2>

            {resultData.riskLevel && (
                <div style={{ margin: '16px 0', textAlign: 'center' }}>
                    <p>
                        <strong>Risk Level:</strong>{' '}
                        <span
                            style={{
                                color: getRiskColor(resultData.riskLevel),
                                fontWeight: 'bold',
                                fontSize: 18,
                            }}
                        >
                            {resultData.riskLevel}
                        </span>
                    </p>

                    {/* Scale Bar with Arrow ABOVE */}
                    <div style={styles.scaleContainer}>
                        {riskSegments.map((seg, index) => {
                            const isCurrent = seg.label.toLowerCase().replace(/\s+/g, '') === currentRiskLabel;
                            return (
                                <div key={seg.label} style={styles.segmentWrapper}>
                                    {isCurrent && <div style={styles.arrow}>▼</div>}
                                    <Tooltip title={seg.label}>
                                        <div style={styles.segment(seg.color, index === 0, index === riskSegments.length - 1)} />
                                    </Tooltip>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {resultData.summary && (
                <p>
                    <strong>Summary:</strong> {resultData.summary}
                </p>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginTop: 16 }}>
                {['severe risk', 'high risk'].includes(resultData.riskLevel?.toLowerCase() || '') && (
                    <Button style={styles.resultBT} type="primary" onClick={() => navigate('/rarepredict')}>
                        Explore Rare Predict
                    </Button>
                )}
                <Button style={styles.resultBT} type="default" onClick={() => navigate('/')}>
                    Re-start
                </Button>
            </div>
        </div>
    );
};

export default ResultPanel;
