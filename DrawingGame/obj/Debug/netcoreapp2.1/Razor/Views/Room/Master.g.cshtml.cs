#pragma checksum "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\Room\Master.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "0b01ad89d5de22b3f095b65e4f74b54010bc1e6e"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Room_Master), @"mvc.1.0.view", @"/Views/Room/Master.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Room/Master.cshtml", typeof(AspNetCore.Views_Room_Master))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\_ViewImports.cshtml"
using DrawingGame;

#line default
#line hidden
#line 2 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\_ViewImports.cshtml"
using DrawingGame.Models;

#line default
#line hidden
#line 5 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\Room\Master.cshtml"
using DAL.Model;

#line default
#line hidden
#line 6 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\Room\Master.cshtml"
using Microsoft.AspNetCore.Identity;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"0b01ad89d5de22b3f095b65e4f74b54010bc1e6e", @"/Views/Room/Master.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"8fd4ce0b3bbf6f6a98184ef8abde444c273cad69", @"/Views/_ViewImports.cshtml")]
    public class Views_Room_Master : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<DrawingGame.Models.RoomModel>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 1 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\Room\Master.cshtml"
  
    ViewData["Title"] = "Rysuneczki - najlepsza gra imprezowa!";

#line default
#line hidden
            BeginContext(73, 2, true);
            WriteLiteral("\r\n");
            EndContext();
            BeginContext(131, 2, true);
            WriteLiteral("\r\n");
            EndContext();
            BeginContext(170, 19, true);
            WriteLiteral("\r\nSTWORZYLES POKOJ ");
            EndContext();
            BeginContext(190, 14, false);
#line 10 "C:\Users\mijal\source\repos\DrawingGame\DrawingGame\Views\Room\Master.cshtml"
            Write(Model.RoomCode);

#line default
#line hidden
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<DrawingGame.Models.RoomModel> Html { get; private set; }
    }
}
#pragma warning restore 1591