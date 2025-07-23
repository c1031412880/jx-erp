function dataURIToBlob(dataURI) {
    var binStr = atob(dataURI.split(",")[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
    }
    return new Blob([arr], { type: "application/octet-stream" });
}
function getEleStr() {
    return `<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"
	xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
	<head>
		<meta http-equiv="Content-Type" content="application/xml; charset=utf-8">
		<meta name="ProgId" content="Excel.Sheet">
		<meta name=Generator content="Microsoft Excel 15">
		<style>
            /* @page
                {
                    margin: 1.00in 0.75in 1.00in 0.75in;
                    mso-header-margin: 0.50in;
                    mso-footer-margin: 0.50in;
                    mso-page-orientation: landscape;
                    {SheetPage}
                }
			*/
		</style>
        <style type="text/css">
        table{font-size:8pt;text-align: center;}
    table th{text-align: center;font-weight: bold;color:#fff;}
    table td{text-align: center;}
   </style>
   <style type="text/css">
   {SheetStyle}
  </style>
   
		<!--[if gte mso 9]>
   <xml>
    <x:ExcelWorkbook>
     <x:ExcelWorksheets>
      <x:ExcelWorksheet>
       <x:Name>sheet1</x:Name>
       <x:WorksheetOptions>
        <x:DefaultRowHeight>285</x:DefaultRowHeight>
        <x:Selected/>
        <x:TopRowVisible>0</x:TopRowVisible>
        <x:Panes>
         <x:Pane>
          <x:Number>0</x:Number>
          <x:ActiveCol>0</x:ActiveCol>
          <x:ActiveRow>0</x:ActiveRow>
          <x:RangeSelection>K326</x:RangeSelection>
         </x:Pane>
        </x:Panes>
        <x:ProtectContents>False</x:ProtectContents>
        <x:ProtectObjects>False</x:ProtectObjects>
        <x:ProtectScenarios>False</x:ProtectScenarios>
        <x:PageBreakZoom>100</x:PageBreakZoom>
        <x:Print>
         <x:ValidPrinterInfo/>
         <x:PaperSizeIndex>9</x:PaperSizeIndex>
        </x:Print>
       </x:WorksheetOptions>
      </x:ExcelWorksheet>
     </x:ExcelWorksheets>
     <x:ProtectStructure>False</x:ProtectStructure>
     <x:ProtectWindows>False</x:ProtectWindows>
     <x:SelectedSheets>0</x:SelectedSheets>
     <x:WindowHeight>12540</x:WindowHeight>
     <x:WindowWidth>28800</x:WindowWidth>
    </x:ExcelWorkbook>
   </xml>
  <![endif]-->
	</head>
	<body>
		<table cellpadding="0" cellspacing="0" style='border-collapse:collapse;table-layout:fixed;'>
            {SheetTitle}
            {SheetContent}
            {SheetSignOff}
        </table>
		</body>
</html>`;
}
var base64 = function (s) {
    return window.btoa(unescape(encodeURIComponent(s)));
}
var format = function (s, c) {
    return s.replace(/{(\w+)}/g, function (m, p) {
        return c[p];
    });
};
var uri = "data:application/vnd.ms-excel;base64,";
var tablesToExcel = function (table, filename, style = '', page = '',SheetTitle,SheetSignOff) {
    if (filename) {
        if (filename.indexOf(".xls") == -1) {
            filename = filename + ".xls";
        }
    }
    var str = getEleStr();

    /*
    mso-page-orientation: landscape; //横向
    mso-page-orientation: portrait; //纵向
     */
    var formatStr = format(str, {
        SheetContent: table,
        SheetTitle: SheetTitle,
        SheetSignOff: SheetSignOff,
        SheetStyle: style,
        SheetPage: page
    });

    var link = document.createElement("A");
    var href = uri + base64(formatStr);
    link.href = URL.createObjectURL(dataURIToBlob(href));
    link.download = filename || "Workbook.xls";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

const importToExcel = function (excelInfo) {
    let excelName = excelInfo.name || "Workbook";
    let sheetInfo = excelInfo.sheets;
    let content = sheetInfo.content;
    let html = '';
    let SheetTitle = excelInfo.sheets.titles
    let SheetSignOff = excelInfo.sheets.signOff
    if (typeof content == "string") {
        html = content;
    }
    tablesToExcel(html, excelName, excelInfo.style, excelInfo.page,SheetTitle,SheetSignOff);
};
export default importToExcel;
