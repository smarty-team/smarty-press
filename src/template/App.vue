<template>
<link rel="stylesheet" href="assets/adminlte.min.css" />
<body class="hold-transition sidebar-mini layout-fixed">
  <div class="wrapper fixed">
    <div class="main-header"></div>
    <div class="sidebar-wrapper">
      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <div class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="assets/logo.png" class="img-circle elevation-2" alt="User Image" />
            </div>
            <div class="info">
              <a href="#" class="d-block">Joseph Xia</a>
            </div>
          </div>
          <!-- Sidebar Menu -->
          <nav class="mt-2">
            <ul
              class="nav nav-pills nav-sidebar flex-column"
              data-widget="treeview"
              role="menu"
              data-accordion="false"
            >
              <!-- Add icons to the links using the .nav-icon class
              with font-awesome or any other icon font library-->
              <li class="nav-item has-treeview menu-open">
                <ul class="nav nav-treeview">
                  <li class="nav-item" v-for="item in menu" v-bind:key="item.path">
                    <a :href="item.path" class="nav-link">
                      <i class="far fa-circle nav-icon"></i>
                      <p>{{item.prefix}}{{item.name}}</p>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </nav>
          <!-- /.sidebar-menu -->
        </div>
        <!-- /.sidebar -->
      </aside>
    </div>

    <!-- Content Wrapper. Contains page content -->
    <div class="content-wrapper">
      <!-- Content Header (Page header) -->
      <div class="content-header">

      </div>
      <!-- /.content-header -->
      <!-- Main content -->
      <div class="content">
        <div v-html="markdown"></div>
        <!-- <h1>AAACCC</h1> -->
      </div>
      <!-- /.content -->
    </div>

    <aside class="control-sidebar control-sidebar-dark"></aside>
    <footer class="main-footer">
      <strong>
        Copyright &copy; 2020-2080
        <a href="https://adminlte.io">Smart Press</a>.
      </strong>
      All rights reserved.
      <div class="float-right d-none d-sm-inline-block">
        <b>Version</b> 0.0.1
      </div>
    </footer>
  </div>
</body>

<script src="assets/jquery.min.js"></script>
<script src="assets/adminlte.min.js"></script>
</template>
<script>
</script>