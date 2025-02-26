import Script from 'next/script';

export const GoogleMapsLoader = ({ onLoad, onError }) => <Script src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=beta&libraries=marker`} strategy="beforeInteractive" loading="async" onLoad={onLoad} onError={onError} />;
