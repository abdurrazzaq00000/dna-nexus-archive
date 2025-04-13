
import React from "react";
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
    sampleId: sample.sample_id,
    patientName: sample.patient_name,
  });
  
  return (
    <Card className="overflow-hidden bg-white p-4 flex flex-col items-center">
      {/* In a real implementation, we'd use a QR code library */}
      <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-xs text-center p-2 border border-gray-300">
        QR Code for {sample.sample_id}
        <br />
        (Actual QR would be generated here)
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
