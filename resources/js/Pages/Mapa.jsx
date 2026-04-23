import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PlaceCard from '../Components/PlaceCard';

const GOOGLE_MAPS_API_KEY = 'AIzaSyAP-pYLeiSe1kZulYR16WvNHlNswMtR5zc';

export default function Mapa({ auth, places = [], categories = [], userLocation = null, radius = 500 }) {
    const mapRef = useRef(null);
    const googleMapRef = useRef(null);
    const markersRef = useRef([]);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [mapError, setMapError] = useState(null);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [infoWindow, setInfoWindow] = useState(null);
    const [nearestFilter, setNearestFilter] = useState(false);
    const [userPos, setUserPos] = useState(userLocation);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const sanlucarCenter = { lat: 36.7873, lng: -6.9869 };

    const filteredPlaces = useCallback(() => {
        let result = places;
        
        if (selectedCategory) {
            result = result.filter(p => Number(p.category_id) === Number(selectedCategory));
        }
        
        if (nearestFilter && userPos) {
            result = result.filter(p => p.within_radius);
        }
        
        return result;
    }, [places, selectedCategory, nearestFilter, userPos]);

    const loadGoogleMaps = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const initMap = useCallback(async () => {
        try {
            await loadGoogleMaps();
            
            const center = userPos 
                ? { lat: userPos.lat, lng: userPos.lng }
                : sanlucarCenter;

            const map = new window.google.maps.Map(mapRef.current, {
                center,
                zoom: 14,
                mapId: 'DEMO_MAP_ID',
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: true,
            });

            googleMapRef.current = map;
            setMapLoaded(true);

            window.google.maps.event.addListener(map, 'click', () => {
                setSelectedPlace(null);
                setInfoWindow(null);
            });

        } catch (error) {
            console.error('Error loading Google Maps:', error);
            setMapError('Error al cargar el mapa. Por favor, intenta de nuevo.');
        }
    }, [userPos]);

    useEffect(() => {
        initMap();
    }, [initMap]);

    const clearMarkers = () => {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
    };

    useEffect(() => {
        if (!mapLoaded || !googleMapRef.current) return;

        clearMarkers();

        const placesToShow = filteredPlaces();
        const bounds = new window.google.maps.LatLngBounds();

        placesToShow.forEach(place => {
            if (!place.latitude || !place.longitude) return;

            const marker = new window.google.maps.Marker({
                position: { lat: parseFloat(place.latitude), lng: parseFloat(place.longitude) },
                map: googleMapRef.current,
                title: place.name,
                zIndex: 1000,
                icon: {
                    path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                    fillColor: '#D97706',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3,
                    scale: 1.8,
                    anchor: new window.google.maps.Point(12, 22),
                },
            });

            marker.addListener('click', () => {
                setSelectedPlace(place);
                setInfoWindow({
                    position: marker.getPosition(),
                    place,
                });
            });

            markersRef.current.push(marker);
            bounds.extend(marker.getPosition());
        });

        if (userPos) {
            const userMarker = new window.google.maps.Marker({
                position: { lat: userPos.lat, lng: userPos.lng },
                map: googleMapRef.current,
                title: 'Tu ubicación',
                zIndex: 999,
                icon: {
                    path: window.google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: '#3B82F6',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3,
                },
            });
            markersRef.current.push(userMarker);
            bounds.extend(userMarker.getPosition());
        }

        if (markersRef.current.length > 0) {
            googleMapRef.current.fitBounds(bounds, 50);
        }
    }, [mapLoaded, filteredPlaces, userPos]);

    const getUserLocation = () => {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta la geolocalización');
            return;
        }

        setIsLocating(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const newPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                setUserPos(newPos);
                setIsLocating(false);
                
                window.history.pushState({}, '', `/mapa?lat=${newPos.lat}&lng=${newPos.lng}`);
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('No se pudo obtener tu ubicación. Verifica los permisos.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const clearUserLocation = () => {
        setUserPos(null);
        window.history.pushState({}, '', '/mapa');
    };

    const displayedPlaces = filteredPlaces();

    return (
        <>
            <Head title="Mapa - DescubreSanlúcar" />
            
            <div className="page-root">
                <Navbar auth={auth} />

                <main className="map-page">
                    <div className="map-container">
                        <div className="map-sidebar">
                            <div className="map-sidebar-header">
                                <h1>Mapa de Sanlúcar</h1>
                                <p>{displayedPlaces.length} lugares</p>
                            </div>

                            <div className="map-filters">
                                <button
                                    className={`filter-btn ${nearestFilter ? 'active' : ''}`}
                                    onClick={() => setNearestFilter(!nearestFilter)}
                                    disabled={!userPos}
                                    title={userPos ? 'Mostrar solo lugares a menos de 500m' : 'Activa tu ubicación primero'}
                                >
                                    📍 Más cercanos (500m)
                                </button>

                                {userPos ? (
                                    <button className="filter-btn secondary" onClick={clearUserLocation}>
                                        ✕ Quitar mi ubicación
                                    </button>
                                ) : (
                                    <button 
                                        className="filter-btn primary" 
                                        onClick={getUserLocation}
                                        disabled={isLocating}
                                    >
                                        {isLocating ? '📡 Localizando...' : '📍 Mi ubicación'}
                                    </button>
                                )}

                                <select
                                    className="filter-select"
                                    value={selectedCategory || ''}
                                    onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">Todas las categorías</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {nearestFilter && userPos && (
                                <div className="nearest-notice">
                                    <span>📍 Mostrando lugares a menos de {radius}m de ti</span>
                                </div>
                            )}

                            <div className="map-results">
                                {displayedPlaces.length > 0 ? (
                                    displayedPlaces.map(place => (
                                        <div 
                                            key={place.id} 
                                            className={`map-result-item ${selectedPlace?.id === place.id ? 'selected' : ''}`}
                                            onClick={() => {
                                                setSelectedPlace(place);
                                                if (place.latitude && place.longitude && googleMapRef.current) {
                                                    googleMapRef.current.panTo({
                                                        lat: parseFloat(place.latitude),
                                                        lng: parseFloat(place.longitude),
                                                    });
                                                    googleMapRef.current.setZoom(16);
                                                }
                                            }}
                                        >
                                            <h3>{place.name}</h3>
                                            <p className="place-category">{place.category?.icon} {place.category?.label}</p>
                                            <p className="place-address">{place.address}</p>
                                            {place.distance && (
                                                <span className="place-distance">{place.distance}m</span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-results">
                                        <p>No hay lugares para mostrar</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="map-wrapper">
                            {mapError && (
                                <div className="map-error">
                                    <p>{mapError}</p>
                                    <button onClick={initMap}>Reintentar</button>
                                </div>
                            )}
                            <div ref={mapRef} className="google-map" />
                            
                            {!mapLoaded && !mapError && (
                                <div className="map-loading">
                                    <div className="spinner" />
                                    <p>Cargando mapa...</p>
                                </div>
                            )}

                            {selectedPlace && (
                                <div className="place-card-overlay" onClick={() => setSelectedPlace(null)}>
                                    <div className="place-card" onClick={(e) => e.stopPropagation()}>
                                        <button className="place-card-close" onClick={() => setSelectedPlace(null)}>
                                            ✕
                                        </button>
                                        {selectedPlace.image ? (
                                            <img 
                                                src={selectedPlace.image} 
                                                alt={selectedPlace.name}
                                                className="place-card-image"
                                            />
                                        ) : (
                                            <div className="place-card-image place-card-image-placeholder">
                                                <span>{selectedPlace.category?.icon || '📍'}</span>
                                            </div>
                                        )}
                                        <div className="place-card-content">
                                            <h3 className="place-card-title">{selectedPlace.name}</h3>
                                            <p className="place-card-category">
                                                {selectedPlace.category?.icon} {selectedPlace.category?.label}
                                            </p>
                                            <p className="place-card-address">{selectedPlace.address}</p>
                                            {selectedPlace.distance && (
                                                <p className="place-card-distance">
                                                    📍 A {selectedPlace.distance}m
                                                </p>
                                            )}
                                            <div className="place-card-actions">
                                                <a 
                                                    href={`/lugares/${selectedPlace.slug}`}
                                                    className="place-card-btn place-card-btn-primary"
                                                >
                                                    Ver página
                                                </a>
                                                <a 
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.latitude},${selectedPlace.longitude}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="place-card-btn place-card-btn-secondary"
                                                >
                                                    Cómo llegar
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                <Footer sections={[]} />
            </div>

            <style>{`
                .map-page {
                    height: calc(100vh - 64px);
                    display: flex;
                }

                .map-container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                }

                .map-sidebar {
                    width: 350px;
                    min-width: 350px;
                    background: #fff;
                    border-right: 1px solid #e5e7eb;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .map-sidebar-header {
                    padding: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .map-sidebar-header h1 {
                    font-size: 20px;
                    font-weight: 600;
                    margin: 0 0 4px;
                    color: #1f2937;
                }

                .map-sidebar-header p {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0;
                }

                .map-filters {
                    padding: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .filter-btn {
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    color: #374151;
                }

                .filter-btn:hover:not(:disabled) {
                    background: #f3f4f6;
                }

                .filter-btn.active {
                    background: #fef3c7;
                    border-color: #d97706;
                    color: #92400e;
                }

                .filter-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .filter-btn.primary {
                    background: #3b82f6;
                    color: white;
                    border: none;
                }

                .filter-btn.primary:hover:not(:disabled) {
                    background: #2563eb;
                }

                .filter-btn.secondary {
                    background: #f3f4f6;
                    border: none;
                }

                .filter-select {
                    padding: 10px 14px;
                    border-radius: 8px;
                    font-size: 14px;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    color: #374151;
                    cursor: pointer;
                }

                .nearest-notice {
                    padding: 8px 12px;
                    background: #dbeafe;
                    font-size: 13px;
                    color: #1e40af;
                    text-align: center;
                }

                .map-results {
                    flex: 1;
                    overflow-y: auto;
                    padding: 8px;
                }

                .map-result-item {
                    padding: 12px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: background 0.2s;
                    border: 1px solid transparent;
                    margin-bottom: 8px;
                }

                .map-result-item:hover {
                    background: #f9fafb;
                }

                .map-result-item.selected {
                    background: #fef3c7;
                    border-color: #d97706;
                }

                .map-result-item h3 {
                    font-size: 15px;
                    font-weight: 500;
                    margin: 0 0 4px;
                    color: #1f2937;
                }

                .place-category {
                    font-size: 13px;
                    color: #6b7280;
                    margin: 0 0 4px;
                }

                .place-address {
                    font-size: 12px;
                    color: #9ca3af;
                    margin: 0;
                }

                .place-distance {
                    display: inline-block;
                    margin-top: 6px;
                    padding: 2px 8px;
                    background: #dbeafe;
                    color: #1e40af;
                    border-radius: 12px;
                    font-size: 12px;
                }

                .map-wrapper {
                    flex: 1;
                    position: relative;
                }

                .google-map {
                    width: 100%;
                    height: 100%;
                }

                .map-error {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                    padding: 20px;
                    background: #fee;
                    border-radius: 8px;
                }

                .map-loading {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid #e5e7eb;
                    border-top-color: #3b82f6;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 12px;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .no-results {
                    text-align: center;
                    padding: 40px 20px;
                    color: #6b7280;
                }

                @media (max-width: 768px) {
                    .map-container {
                        flex-direction: column-reverse;
                    }
                    .map-sidebar {
                        width: 100%;
                        min-width: unset;
                        height: 40%;
                    }
                    .map-wrapper {
                        height: 60%;
                    }
                }

                .place-card-overlay {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    top: 0;
                    background: rgba(0, 0, 0, 0.3);
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    z-index: 1000;
                    padding: 20px;
                }

                .place-card {
                    background: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    overflow: hidden;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    position: relative;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .place-card-close {
                    position: absolute;
                    top: 12px;
                    right: 12px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: none;
                    background: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    color: #374151;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                }

                .place-card-close:hover {
                    background: #f3f4f6;
                }

                .place-card-image {
                    width: 100%;
                    height: 180px;
                    object-fit: cover;
                }

                .place-card-image-placeholder {
                    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 48px;
                }

                .place-card-content {
                    padding: 16px;
                }

                .place-card-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0 0 4px;
                }

                .place-card-category {
                    font-size: 14px;
                    color: #6b7280;
                    margin: 0 0 4px;
                }

                .place-card-address {
                    font-size: 13px;
                    color: #9ca3af;
                    margin: 0 0 8px;
                }

                .place-card-distance {
                    font-size: 13px;
                    color: #3b82f6;
                    margin: 0 0 12px;
                    font-weight: 500;
                }

                .place-card-actions {
                    display: flex;
                    gap: 10px;
                }

                .place-card-btn {
                    flex: 1;
                    padding: 10px 16px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: center;
                    text-decoration: none;
                    transition: all 0.2s;
                }

                .place-card-btn-primary {
                    background: #3b82f6;
                    color: white;
                }

                .place-card-btn-primary:hover {
                    background: #2563eb;
                }

                .place-card-btn-secondary {
                    background: white;
                    color: #374151;
                    border: 1px solid #e5e7eb;
                }

                .place-card-btn-secondary:hover {
                    background: #f3f4f6;
                }
            `}</style>
        </>
    );
}