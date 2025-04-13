
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card } from "@/components/ui/card";
import { Sample } from "@/types/sample";

interface QRGeneratorProps {
  sample: Sample;
  size?: number;
  includeDetails?: boolean;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({
  sample,
  size = 128,
  includeDetails = true
}) => {
  const qrValue = JSON.stringify({
    id: sample.id,
    sample_id: sample.sample_id,
    patientName: sample.patient_name,
  });
  
  return (
    <Card className="overflow-hidden bg-white p-4 flex flex-col items-center">
      <div className="bg-white p-2 border border-gray-200 rounded">
        <QRCodeSVG 
          value={qrValue} 
          size={size} 
          level="H" 
          includeMargin={true}
          bgColor={"#ffffff"}
          fgColor={"#000000"}
        />
      </div>
      
      {includeDetails && (
        <div className="mt-4 text-center">
          <div className="font-bold">{sample.sample_id}</div>
          <div className="text-sm text-muted-foreground">{sample.patient_name}</div>
          <div className="text-sm text-muted-foreground">
            Status: <span className="font-medium">{sample.status}</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default QRGenerator;
