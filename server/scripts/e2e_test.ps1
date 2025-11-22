param(
  [string]$ServerUrl = "http://localhost:5000",
  [string]$PackageId = "",
  [string]$Name = "Test User",
  [string]$Email = "test@example.com",
  [string]$Phone = "9999999999",
  [string]$Message = "Automated test enquiry from e2e_test.ps1",
  [string]$DevAdminToken = "",
  [string]$AdminJwt = ""
)

function Write-JsonPretty($obj) {
  $json = $obj | ConvertTo-Json -Depth 5
  Write-Output $json
}

try {
  Write-Output "[e2e] Using server: $ServerUrl"

  # 1) Get package id if not supplied
  if (-not $PackageId) {
    Write-Output "[e2e] Fetching packages..."
    $pkgs = Invoke-RestMethod -Uri "$ServerUrl/api/packages" -ErrorAction Stop
    if (-not $pkgs.docs -or $pkgs.docs.Count -eq 0) { Write-Error "No packages returned from server"; exit 2 }
    $PackageId = $pkgs.docs[0]._id
    Write-Output "[e2e] Using package id: $PackageId"
  } else {
    Write-Output "[e2e] Using provided package id: $PackageId"
  }

  # 2) Submit enquiry
  $body = @{ name = $Name; email = $Email; phone = $Phone; packageId = $PackageId; message = $Message } | ConvertTo-Json
  Write-Output "[e2e] Submitting enquiry..."
  $res = Invoke-RestMethod -Method Post -Uri "$ServerUrl/api/enquiries" -ContentType 'application/json' -Body $body -ErrorAction Stop
  Write-Output "[e2e] Enquiry POST response:"
  Write-JsonPretty $res

  # 3) Fetch admin enquiries
  if (-not $AdminJwt -and -not $DevAdminToken) {
    Write-Warning "No admin token provided (AdminJwt or DevAdminToken). Skipping admin fetch."
    exit 0
  }

  $headers = @{}
  if ($AdminJwt) { $headers.Authorization = "Bearer $AdminJwt" } else { $headers['x-admin-token'] = $DevAdminToken }

  Write-Output "[e2e] Fetching admin enquiries..."
  $adminRes = Invoke-RestMethod -Uri "$ServerUrl/api/admin/enquiries" -Headers $headers -ErrorAction Stop
  Write-Output "[e2e] Admin enquiries response:"
  Write-JsonPretty $adminRes

  Write-Output "[e2e] Done."
} catch {
  Write-Error "[e2e] Error: $($_.Exception.Message)"
  exit 1
}
