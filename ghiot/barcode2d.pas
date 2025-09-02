procedure Barcode2D1OnBeforePrint(Sender: TfrxComponent);
var
   barcode2d: TfrxBarCode2DView;                                                                         
begin
   barcode2d := TfrxBarCode2DView(Sender);
 barcode2d.Text := <WKOrder."rplineqrcode">                                                             

end;

begin

end.
