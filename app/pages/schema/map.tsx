import React, { FC, useState } from 'react'

import { LatLngExpression } from 'leaflet'
import { Marker, Popup, useMapEvents } from 'react-leaflet'

import { BaseField } from './types'

interface CustomMapProps extends Pick<BaseField, 'optional'> {}

export const CustomMap: FC<CustomMapProps> = ({ optional }) => {
    const [position, setPosition] = useState<LatLngExpression | null>(null)

    const map = useMapEvents({
        click(e) {
            setPosition({ ...e.latlng })
        },
        contextmenu() {
            optional ? setPosition(null) : null
        },
        locationfound(e) {
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return (
        <>
            {position ? (
                <Marker position={position}>
                    <Popup className='title_smaller'>مکان انتخابی</Popup>
                </Marker>
            ) : null}
        </>
    )
}
