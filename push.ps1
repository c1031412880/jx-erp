#param ($version, $path, $name)

#创建ftp目录
function Create-FtpDirectory {
  param(
    [Parameter(Mandatory=$true)]
    [string]
    $sourceuri,
    [Parameter(Mandatory=$true)]
    [string]
    $username,
    [Parameter(Mandatory=$true)]
    [string]
    $password
  )
  if ($sourceUri -match '\\$|\\\w+$') { throw 'sourceuri should end with a file name' }

  $ftprequest = [System.Net.FtpWebRequest]::Create($sourceuri);
  $ftprequest.Credentials = New-Object System.Net.NetworkCredential($username,$password)

  try
  {
    $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::DeleteFile
    $ftprequest.GetResponse()
  }
  catch
  {
  }
  $ftprequest.Method = [System.Net.WebRequestMethods+Ftp]::MakeDirectory
  $ftprequest.UseBinary = $true
  $response = $ftprequest.GetResponse();

  Write-Host Upload File Complete, status $response.StatusDescription

  $response.Close();
}

$version = Read-Host '请输入发布版本号'

$name = 'ERPWeb'
if([String]::IsNullOrWhiteSpace($version))
{
    $version = 'latest'
}

$publishPath = "./dist"
$outputZipPath = "./$name-$version.zip"

#生成压缩包
Compress-Archive -Path $publishPath/* -DestinationPath $outputZipPath -Force

# 上传发布出来的压缩包 到 FTP 服务器
$file = New-Object System.IO.FileInfo($outputZipPath)
$filePath = (Resolve-Path $outputZipPath)
$fileName = $file.Name

$targetDir = "install_package/erp-web/"
$ftp = "ftp://122.225.198.118:19921/"
$user = "ftp01"
$pass = "mapsoft123!"

#Create-FtpDirectory -sourceuri ($ftp + $targetDir) -username $user -password $pass
$webclient = New-Object System.Net.WebClient
$webclient.Credentials = New-Object System.Net.NetworkCredential($user, $pass)

Write-Output "$fileName Start Upload..."

$uri = New-Object System.Uri($ftp + $targetDir + $fileName) 
$webclient.UploadFile($uri, $filePath)

Remove-Item -Path $publishPath -Recurse
Remove-Item -Path $outputZipPath
Write-Output "$fileName Upload Success"
