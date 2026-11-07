# Script para versionar automaticamente (Cache-Busting por Hash SHA-256), gerar version.json e criar o pacote único (plataforma_transpetro_bundle.html)
$ErrorActionPreference = "Stop"
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$utf8 = New-Object System.Text.UTF8Encoding($false)

$css  = [System.IO.File]::ReadAllText((Join-Path $dir "styles.css"), $utf8)
$js1  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_edital_plano.js"), $utf8)
$js2  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_teoria.js"), $utf8)
$js3  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_questoes_parte1.js"), $utf8)
$js4  = [System.IO.File]::ReadAllText((Join-Path $dir "dados_questoes_parte2.js"), $utf8)
$js5  = [System.IO.File]::ReadAllText((Join-Path $dir "app.js"), $utf8)

# Calcula Hash SHA-256 curto (10 caracteres) a partir do conteúdo de todos os estilos e scripts
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$combinedBytes = $utf8.GetBytes($css + $js1 + $js2 + $js3 + $js4 + $js5)
$hashBytes = $sha256.ComputeHash($combinedBytes)
$buildHash = ([System.BitConverter]::ToString($hashBytes).Replace("-", "").Substring(0, 10)).ToLower()

# Atualiza index.html automaticamente com o novo ?v=$buildHash e window.APP_BUILD_HASH
$indexPath = Join-Path $dir "index.html"
$htmlRaw = [System.IO.File]::ReadAllText($indexPath, $utf8)
$htmlUpdated = [System.Text.RegularExpressions.Regex]::Replace($htmlRaw, 'window\.APP_BUILD_HASH\s*=\s*"[^"]*"', "window.APP_BUILD_HASH = `"$buildHash`"")
$htmlUpdated = [System.Text.RegularExpressions.Regex]::Replace($htmlUpdated, 'href="styles\.css(\?v=[^"]*)?"', "href=`"styles.css?v=$buildHash`"")
$htmlUpdated = [System.Text.RegularExpressions.Regex]::Replace($htmlUpdated, 'src="(dados_edital_plano|dados_teoria|dados_questoes_parte1|dados_questoes_parte2|app)\.js(\?v=[^"]*)?"', "src=`"`$1.js?v=$buildHash`"")
[System.IO.File]::WriteAllText($indexPath, $htmlUpdated, $utf8)

# Gera version.json para detecção automática de nova versão em tempo real no GitHub Pages
$versionJsonPath = Join-Path $dir "version.json"
$nowIso = (Get-Date).ToString("o")
$versionJson = "{`n  `"hash`": `"$buildHash`",`n  `"updatedAt`": `"$nowIso`"`n}`n"
[System.IO.File]::WriteAllText($versionJsonPath, $versionJson, $utf8)

# Monta o bundle único para Google Sites (substituindo tags de estilo e scripts de forma literal)
$bundleHtml = $htmlUpdated
$bundleHtml = [System.Text.RegularExpressions.Regex]::Replace($bundleHtml, '<link rel="stylesheet"[^>]*href="styles\.css[^"]*"[^>]*>', [System.Text.RegularExpressions.MatchEvaluator]{ param($m) "<style>`n$css`n</style>" })
$bundleHtml = $bundleHtml.Replace("<script src=`"dados_edital_plano.js?v=$buildHash`"></script>", "<script>`n$js1`n</script>")
$bundleHtml = $bundleHtml.Replace("<script src=`"dados_teoria.js?v=$buildHash`"></script>", "<script>`n$js2`n</script>")
$bundleHtml = $bundleHtml.Replace("<script src=`"dados_questoes_parte1.js?v=$buildHash`"></script>", "<script>`n$js3`n</script>")
$bundleHtml = $bundleHtml.Replace("<script src=`"dados_questoes_parte2.js?v=$buildHash`"></script>", "<script>`n$js4`n</script>")
$bundleHtml = $bundleHtml.Replace("<script src=`"app.js?v=$buildHash`"></script>", "<script>`n$js5`n</script>")

$bundlePath = Join-Path $dir "plataforma_transpetro_bundle.html"
[System.IO.File]::WriteAllText($bundlePath, $bundleHtml, $utf8)

try {
    Set-Clipboard -Value $bundleHtml
    Write-Output "✅ Build Hash [$buildHash] aplicado em index.html, version.json e '$bundlePath' (copiado para a Área de Transferência)."
} catch {
    Write-Output "✅ Build Hash [$buildHash] aplicado em index.html, version.json e '$bundlePath'."
}
