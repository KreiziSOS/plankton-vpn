# Plankton OpenVPN

OpenVPN is an additional fallback protocol for networks where WireGuard or AmneziaWG are blocked.

Production endpoint:

```text
vpn.plankton.ceo:9443/tcp
```

Start the service:

```bash
docker compose -f docker-compose.openvpn.yml up -d openvpn
```

Optional obfuscation profile:

```bash
docker compose -f docker-compose.openvpn.yml --profile obfs up -d
```

The OpenVPN server data and client storage are persistent Docker volumes:

```text
plankton_openvpn_data
plankton_openvpn_clients
```

The backend creates real clients with:

```bash
docker compose -f docker-compose.openvpn.yml run --rm openvpn easyrsa build-client-full <deviceName> nopass
docker compose -f docker-compose.openvpn.yml run --rm openvpn ovpn_getclient <deviceName>
```

The Mini App stores generated OpenVPN client profiles in Prisma `VpnDevice.configText` so downloads are persistent and do not depend on WG Easy.
