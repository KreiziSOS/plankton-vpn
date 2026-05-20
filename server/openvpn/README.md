# Plankton OpenVPN

OpenVPN is an additional fallback protocol for networks where WireGuard or AmneziaWG are blocked.

Production endpoint:

```text
vpn.plankton.ceo:443/tcp
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

The Mini App stores generated OpenVPN client profiles in Prisma `VpnDevice.configText` so profile downloads do not depend on WG Easy.
