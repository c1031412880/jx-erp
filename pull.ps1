# Config
$today = Get-Date -UFormat "%Y%m%d"
$LogFilePath = "./ftpLog_$today.txt"
$UserName = "ftp01"
$Password = "mapsoft123!"


function REM($Msg){
    $now= Get-Date
    write-host "$now : $Msg" -foregroundcolor Yellow
    Add-Content $LogFilePath "$now : $Msg"
}

function DownloadFile($Username,$Password,$RemoteFile,$LocalFile)
{
    try
    {
        $ErrorActionPreference="Stop";

        if($RemoteFile -eq $null){
            REM "RemoteFile is null"
            return
        }
        if($LocalFile -eq $null){
            REM "LocalFile is null"
            return
        }

        $FTPRequest = [System.Net.FtpWebRequest]::Create($RemoteFile)
        $FTPRequest.Credentials = New-Object System.Net.NetworkCredential($Username,$Password)
        $FTPRequest.Method = [System.Net.WebRequestMethods+Ftp]::DownloadFile
        $FTPRequest.UseBinary = $true
        $FTPRequest.KeepAlive = $false
        # Send the ftp request
        $FTPResponse = $FTPRequest.GetResponse()
        # Get a download stream from the server response
        $ResponseStream = $FTPResponse.GetResponseStream()
        # Create the target file on the local system and the download buffer
        $LocalFileFile = New-Object IO.FileStream ($LocalFile,[IO.FileMode]::Create)
        [byte[]]$ReadBuffer = New-Object byte[] 1024
        if($ResponseStream -eq $null){
            return
        }
        # Loop through the download
        do {
            $ReadLength = $ResponseStream.Read($ReadBuffer,0,1024)
            $LocalFileFile.Write($ReadBuffer,0,$ReadLength)

        }
        while ($ReadLength -ne 0)
        $LocalFileFile.Close()
        REM "$RemoteFile "
    }
    catch
    {
        REM("Exception Msg: $_")
    }
}

function UnzipFile([string]$sourceFile, [string]$targetFolder)
{
    try
    {
        if(!(Test-Path $targetFolder))
        {
            mkdir $targetFolder
        }
        $shell = New-Object -ComObject Shell.Application -Strict:$false
        $target = $shell.NameSpace($targetFolder)
        $target.CopyHere($sourceFile)

        REM "$RemoteFile 解压成功"
    }
    catch
    {
        REM("Exception Msg: $_")
    }
}
$fileName = "ERPWeb"
$version = "latest"
$path = "D:\deploy-test\erp-web"
$topath = "D:\deploy-test\erp-web\dist"

#下载版本压缩包
DownloadFile $UserName $Password "ftp://122.225.198.118:19921/install_package/erp-web/$fileName-$version.zip" "$path\$fileName-$version.zip"
#解压
UnzipFile "$path\$fileName-$version.zip\*" "$path\$fileName-$version"
#复制
Copy-Item -Path "$path\$fileName-$version\*" -Destination $topath -force -Recurse
Copy-Item -Path "$path\config.js" -Destination "$topath\static\js" -force
#删除
Remove-Item -Path "$path\$fileName-$version.zip" -Recurse
Remove-Item -Path "$path\$fileName-$version" -Recurse


