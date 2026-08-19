import { useEffect } from 'react';
import {
  type AssetSource,
  type AssetSourceComponentProps,
  useClient,
} from 'sanity';

export const HeicUploadAdapter = {
  name: 'heic-upload-adapter',
  title: 'HEIC Auto-Convert',
  component: function HeicAdapterComponent(props: AssetSourceComponentProps) {
    const { onSelect } = props;

    const client = useClient({ apiVersion: '2026-01-01' });

    const convert = require('heic-convert');

    if (!convert) throw new Error('Failed to load heic-convert.');

    useEffect(() => {
      if (typeof window === 'undefined') return;

      // Create a hidden input element to trigger the native file explorer
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*,.heic,.HEIC';

      input.onchange = async (e: Event) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          props.onClose();
          return;
        }

        let fileToUpload = file;
        const buffer = await file.arrayBuffer();

        if (
          file.type === 'image/heic' ||
          file.name.toLowerCase().endsWith('.heic') ||
          file.name.toLowerCase().endsWith('.HEIC')
        ) {
          try {
            const outputBuffer = await convert({
              buffer: new Uint8Array(buffer),
              format: 'JPEG',
              quality: 0.92,
            });

            fileToUpload = new File(
              [outputBuffer], // TypeScript now validates this correctly as a safe BlobPart
              file.name.replace(/\.heic$/i, '.jpg'),
              { type: 'image/jpeg' }
            );
          } catch (error) {
            console.error('HEIC conversion failed:', error);
            props.onClose();
            return;
          }
        }

        // Upload the processed file using the Sanity client instance
        try {
          const assetDoc = await client.assets.upload('image', fileToUpload);
          // Pass the successfully created asset back to the field
          onSelect([{ kind: 'assetDocumentId', value: assetDoc._id }]);
        } catch (uploadError) {
          console.error('Studio asset upload failed:', uploadError);
        } finally {
          props.onClose();
        }
      };

      input.click();
    }, [client, onSelect, props, convert]);

    return null; // Invisible utility component
  },
} as AssetSource;
