// Never use @iconify/react inside this file.
import { ImageResponse } from 'next/og';

// Required for static export
export const dynamic = 'force-static';

export const size = {
  width: 64,
  height: 64,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png"
          alt="Chirag Sahani Portfolio Icon"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </div>
    ),
    {
      ...size, 
    }
  );
}