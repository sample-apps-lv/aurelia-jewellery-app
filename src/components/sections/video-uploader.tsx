import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { prepareVideoUploadFn, registerVideoFn, getVideoStatusFn } from "@/lib/shopify-admin";
import { toast } from "sonner";

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

export function VideoUploader({ value, onChange }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];
    if (!validTypes.includes(file.type) && !file.name.endsWith(".mkv")) {
      toast.error("Invalid file type. Please upload MP4, WebM, or MOV.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadStatus("Preparing upload...");

      // 1. Prepare Staged Upload
      const stagedData = await prepareVideoUploadFn({
        data: {
          filename: file.name,
          mimeType: file.type || "video/mp4",
          fileSize: file.size.toString(),
        }
      });

      if (stagedData.userErrors?.length > 0) {
        throw new Error(stagedData.userErrors[0].message);
      }

      const target = stagedData.stagedTargets[0];
      setUploadStatus("Uploading to Shopify...");

      // 2. Upload to S3
      const formData = new FormData();
      target.parameters.forEach((param: { name: string; value: string }) => {
        formData.append(param.name, param.value);
      });
      formData.append("file", file);

      const uploadResponse = await fetch(target.url, {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file to storage.");
      }

      setUploadStatus("Finalizing upload...");
      // Add a 3-second delay to ensure S3 has settled before registration
      await new Promise(resolve => setTimeout(resolve, 3000));

      setUploadStatus("Registering video...");

      // 3. Register File in Shopify with a retry loop for duration validation issues
      let registerData;
      let regAttempts = 0;
      const maxRegAttempts = 3;

      while (regAttempts < maxRegAttempts) {
        registerData = await registerVideoFn({
          data: {
            resourceUrl: target.resourceUrl,
            filename: file.name,
          }
        });

        if (registerData.userErrors?.length > 0) {
          const isDurationError = registerData.userErrors.some((e: any) => e.message.includes("duration (0s)"));
          if (isDurationError && regAttempts < maxRegAttempts - 1) {
            regAttempts++;
            setUploadStatus(`Registration retry ${regAttempts}/${maxRegAttempts}...`);
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds before retry
            continue;
          }
          throw new Error(registerData.userErrors[0].message);
        }
        break; // Success
      }

      if (!registerData || registerData.userErrors?.length > 0) {
        throw new Error(registerData?.userErrors?.[0]?.message || "Failed to register video.");
      }

      const videoId = registerData.files[0].id;
      setUploadStatus("Processing video (this may take a minute)...");

      // 4. Poll for status
      let attempts = 0;
      const maxAttempts = 30;
      const poll = async () => {
        if (attempts >= maxAttempts) {
          setIsUploading(false);
          toast.warning("Video is still processing. It will appear once ready.");
          return;
        }

        const statusData = await getVideoStatusFn({ data: { id: videoId } });
        if (statusData.fileStatus === "READY" && statusData.sources?.length > 0) {
          // Find the best quality source (prefer mp4 or webm)
          const source = statusData.sources.find((s: any) => s.format === "mp4") || statusData.sources[0];
          onChange(source.url);
          setIsUploading(false);
          setUploadStatus("");
          toast.success("Video uploaded and processed successfully!");
        } else if (statusData.fileStatus === "FAILED") {
          setIsUploading(false);
          const errorMsg = statusData.fileErrors?.[0]?.message || "Video processing failed.";
          toast.error(errorMsg);
        } else {
          attempts++;
          setTimeout(poll, 3000);
        }
      };

      poll();

    } catch (error: any) {
      setIsUploading(false);
      setUploadStatus("");
      toast.error(error.message || "An error occurred during upload.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <FormControl>
          <Input 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="Video URL or upload a file"
            className="flex-1"
            disabled={isUploading}
          />
        </FormControl>
        <div className="relative">
          <input
            type="file"
            id="video-upload"
            className="hidden"
            accept="video/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <Button 
            type="button" 
            variant="outline" 
            asChild
            disabled={isUploading}
          >
            <label htmlFor="video-upload" className="cursor-pointer">
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Upload className="w-4 h-4 mr-2" />
              )}
              Upload
            </label>
          </Button>
        </div>
      </div>
      {isUploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          {uploadStatus}
        </div>
      )}
      {value && !isUploading && (
        <div className="flex items-center gap-2 text-xs text-green-600">
          <CheckCircle2 className="w-3 h-3" />
          Video linked successfully
        </div>
      )}
    </div>
  );
}
