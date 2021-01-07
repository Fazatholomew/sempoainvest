import React from 'react';
import {LabelProps} from 'recharts';

const AxisLabel:React.FC = ({x, y, value}: LabelProps) => {

  return (<text 
    x={x} 
    y={y} 
    dy={-4} 
    fill='white' 
    fontSize={12}
    textAnchor="middle">
      {value}
    </text>
  );
};

export default AxisLabel