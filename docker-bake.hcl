# docker-bake.hcl — reproducible, multi-arch build config.
# Build (local single-platform): docker buildx bake
# Build + push (multi-arch):      docker buildx bake --push
# Override at runtime:            TAG=v2 REGISTRY=ghcr.io/me docker buildx bake

variable "TAG" {
  default = "latest"
}

# The resolved image version (e.g. "2.0.5"), used only for the OCI version
# label. Falls back to TAG so a local, untagged build still gets a label
# rather than the Dockerfile's default.
variable "VERSION" {
  default = TAG
}

variable "REGISTRY" {
  default = "ghcr.io/dbca-wa"
}

# Any value that changes per build (CI passes the run ID). Forces the
# Dockerfile's `apk upgrade` layer to re-run instead of coming from cache.
variable "APK_CACHE_BUST" {
  default = ""
}

variable "PLATFORMS" {
  default = "linux/amd64,linux/arm64"
}

group "default" {
  targets = ["app"]
}

target "app" {
  context    = "."
  dockerfile = "Dockerfile"
  tags       = ["${REGISTRY}/biodiversityaudit2:${TAG}"]
  platforms  = split(",", PLATFORMS)
  cache-from = ["type=gha"]
  cache-to   = ["type=gha,mode=max"]
  args = {
    APK_CACHE_BUST = APK_CACHE_BUST
  }
  # Provenance + SBOM are attached on push (CI). Harmless for local non-push builds.
  attest     = ["type=provenance,mode=max", "type=sbom"]
  # Overrides the Dockerfile's hardcoded LABEL with the actual released
  # version, so the two can't drift apart the way they did for 2.0.5.
  labels = {
    "org.opencontainers.image.version" = VERSION
  }
}
