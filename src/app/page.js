// page.js
"use client";
import { useState, useRef } from "react";

import Map, { Marker, Popup, NavigationControl, GeolocateControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { IoMdWarning } from "react-icons/io";
import Link from "next/link";
import dataloc from "../../data.json";
import classes from "./Page.module.css";

export default function Home() {
	const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
	const [selectedMarker, setSelectedMarker] = useState(null);
	const mapRef = useRef(null);

	const zoomToSelectedLoc = (e, data, index) => {
		e.stopPropagation();
		setSelectedMarker({ data, index });
		mapRef.current.flyTo({ center: [data.lon, data.lat], zoom: 10 });
	};

	return (
		<main className={classes.mainStyle}>
			<Map
				ref={mapRef}
				mapboxAccessToken={mapboxToken}
				mapStyle="mapbox://styles/mapbox/streets-v12"
				style={classes.mapStyle}
				initialViewState={{ latitude: 2.9213, longitude: 101.6559, zoom: 10 }}
				maxZoom={20}
				minZoom={3}
			>
				<GeolocateControl position="top-left" />
				<NavigationControl position="top-left" />

				{dataloc.map((data, index) => {
					return (
						<Marker key={index} longitude={data.lon} latitude={data.lat}>
							<button
								type="button"
								className="cursor-pointer"
								onClick={(e) => zoomToSelectedLoc(e, data, index)}
							>
								{<IoMdWarning size={30} color="tomato" />}
							</button>
						</Marker>
					);
				})}
        {selectedMarker ? (
					<Popup
						offset={25}
						latitude={selectedMarker.data.lat}
						longitude={selectedMarker.data.lon}
						onClose={() => {
							setSelectedMarker(null);
						}}
						closeButton={false}
					>
						<h3 className={classes.popupTitle}>{selectedMarker.data.name}</h3>
						<div className={classes.popupInfo}>
							<label className={classes.popupLabel}>Leak</label>
						</div>
					</Popup>
				) : null}
			</Map>
		</main>
	);
}
