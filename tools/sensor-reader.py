# /// script
# requires-python = ">=3.11"
# dependencies = [
#   "macimu",
#   "pybooklid",
#   "websockets",
# ]
# ///
#
# Reads Mac accelerometer data and streams it to browser clients over WebSocket.
# Requires root: sudo uv run tools/sensor-reader.py

import asyncio
import json
import sys
from macimu import IMU
from pybooklid import LidSensor
import websockets

PORT = 8765
INTERVAL = 1 / 30  # 30 Hz


async def serve() -> None:
    clients: set = set()

    async def handler(ws) -> None:
        clients.add(ws)
        try:
            await ws.wait_closed()
        finally:
            clients.discard(ws)

    lid_sensor = LidSensor()
    with IMU() as imu:
        async with websockets.serve(handler, "localhost", PORT):
            print(f"Sensor server listening on ws://localhost:{PORT}", flush=True)
            while True:
                accel = imu.latest_accel()
                if accel is None:
                    await asyncio.sleep(0.01)
                    continue
                if clients:
                    try:
                        lid = round(lid_sensor.read_angle(), 1)
                    except Exception:
                        lid = 90.0
                    msg = json.dumps(
                        {"x": round(accel.x, 4), "y": round(accel.y, 4), "z": round(accel.z, 4), "lid": lid}
                    )
                    await asyncio.gather(*[ws.send(msg) for ws in clients.copy()])
                await asyncio.sleep(INTERVAL)


try:
    asyncio.run(serve())
except KeyboardInterrupt:
    pass
except PermissionError:
    print("Error: run with root privileges: sudo uv run tools/sensor-reader.py", file=sys.stderr)
    sys.exit(1)
